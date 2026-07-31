<?php

namespace App\Services;

use App\Models\CitizenAddress;
use App\Models\Family;
use App\Models\Grievance;
use App\Models\PollingBooth;
use App\Models\Project;
use App\Models\SchemeApplication;
use App\Models\SchemeBeneficiary;
use App\Models\User;
use App\Models\Village;
use App\Models\Volunteer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ParliamentaryAnalyticsService
{
    public function report(User $user, string $level): array
    {
        $villages = $this->villages($user)->with('mandal.assemblyConstituency.constituency')->get();
        if ($level === 'booth') return $this->boothReport($villages);
        $metrics = $this->villageMetrics($villages->pluck('id'));
        $rows = $this->rollup($villages, $metrics, $level);
        $totals = $this->emptyMetrics();
        foreach ($rows as $row) $totals = $this->add($totals, $row['metrics']);

        return [
            'level' => $level,
            'generated_at' => now()->toIso8601String(),
            'definitions' => [
                'citizens' => 'Distinct citizens with an address assigned to a village in scope.',
                'families' => 'Family records assigned to a village in scope.',
                'applications' => 'Scheme applications assigned to a village in scope.',
                'budget_utilization' => 'Project expenditure divided by sanctioned amount for village-assigned projects.',
            ],
            'totals' => $this->withRates($totals),
            'data' => collect($rows)->map(fn (array $row) => [...$row, 'metrics' => $this->withRates($row['metrics'])])->values(),
        ];
    }

    private function villages(User $user): Builder
    {
        $query = Village::query()->where('is_active', true);
        if ($user->ward_id) return $query->whereHas('wards', fn (Builder $wards) => $wards->whereKey($user->ward_id));
        if ($user->village_id) return $query->whereKey($user->village_id);
        if ($user->mandal_id) return $query->where('mandal_id', $user->mandal_id);
        if ($user->assembly_constituency_id) return $query->whereHas('mandal', fn (Builder $mandals) => $mandals->where('assembly_constituency_id', $user->assembly_constituency_id));
        if ($user->constituency_id) return $query->whereHas('mandal.assemblyConstituency', fn (Builder $assemblies) => $assemblies->where('constituency_id', $user->constituency_id));
        return $query;
    }

    private function villageMetrics(Collection $villageIds): array
    {
        $ids = $villageIds->all();
        if ($ids === []) return [];
        $maps = [
            'citizens' => CitizenAddress::whereIn('village_id', $ids)->selectRaw('village_id, COUNT(DISTINCT citizen_id) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'families' => Family::whereIn('village_id', $ids)->selectRaw('village_id, COUNT(*) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'applications' => SchemeApplication::whereIn('village_id', $ids)->selectRaw('village_id, COUNT(*) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'grievances' => Grievance::whereIn('village_id', $ids)->selectRaw('village_id, COUNT(*) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'pending_grievances' => Grievance::whereIn('village_id', $ids)->whereNotIn('status', ['resolved', 'closed'])->selectRaw('village_id, COUNT(*) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'projects' => Project::whereIn('village_id', $ids)->selectRaw('village_id, COUNT(*) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'sanctioned_amount' => Project::whereIn('village_id', $ids)->selectRaw('village_id, COALESCE(SUM(sanctioned_amount), 0) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'expenditure' => Project::whereIn('village_id', $ids)->selectRaw('village_id, COALESCE(SUM(expenditure), 0) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'volunteers' => Volunteer::whereIn('village_id', $ids)->where('status', 'active')->selectRaw('village_id, COUNT(*) AS aggregate')->groupBy('village_id')->pluck('aggregate', 'village_id'),
            'booths' => PollingBooth::join('wards', 'wards.id', '=', 'polling_booths.ward_id')->whereIn('wards.village_id', $ids)->selectRaw('wards.village_id, COUNT(polling_booths.id) AS aggregate')->groupBy('wards.village_id')->pluck('aggregate', 'village_id'),
            'registered_voters' => PollingBooth::join('wards', 'wards.id', '=', 'polling_booths.ward_id')->whereIn('wards.village_id', $ids)->selectRaw('wards.village_id, COALESCE(SUM(polling_booths.total_voters), 0) AS aggregate')->groupBy('wards.village_id')->pluck('aggregate', 'village_id'),
            'beneficiaries' => SchemeBeneficiary::join('scheme_applications', 'scheme_applications.id', '=', 'scheme_beneficiaries.application_id')->whereIn('scheme_applications.village_id', $ids)->selectRaw('scheme_applications.village_id, COUNT(scheme_beneficiaries.id) AS aggregate')->groupBy('scheme_applications.village_id')->pluck('aggregate', 'village_id'),
        ];
        return collect($ids)->mapWithKeys(function (string $id) use ($maps) {
            $row = $this->emptyMetrics();
            foreach ($maps as $key => $map) $row[$key] = str_contains($key, 'amount') || $key === 'expenditure' ? (float) ($map[$id] ?? 0) : (int) ($map[$id] ?? 0);
            return [$id => $row];
        })->all();
    }

    private function rollup(Collection $villages, array $metrics, string $level): array
    {
        $rows = [];
        foreach ($villages as $village) {
            $mandal = $village->mandal;
            $assembly = $mandal?->assemblyConstituency;
            $constituency = $assembly?->constituency;
            [$id, $name, $parent] = match ($level) {
                'constituency' => [$constituency?->id, $constituency?->name, null],
                'assembly' => [$assembly?->id, $assembly?->name, $constituency?->name],
                'mandal' => [$mandal?->id, $mandal?->name, $assembly?->name],
                'village' => [$village->id, $village->name, $mandal?->name],
            };
            if (!$id) continue;
            $rows[$id] ??= ['id' => $id, 'name' => $name, 'parent_name' => $parent, 'village_count' => 0, 'metrics' => $this->emptyMetrics()];
            $rows[$id]['village_count']++;
            $rows[$id]['metrics'] = $this->add($rows[$id]['metrics'], $metrics[$village->id] ?? $this->emptyMetrics());
        }
        usort($rows, fn (array $a, array $b) => strcasecmp($a['name'], $b['name']));
        return $rows;
    }

    private function emptyMetrics(): array
    {
        return ['citizens' => 0, 'families' => 0, 'applications' => 0, 'beneficiaries' => 0, 'grievances' => 0, 'pending_grievances' => 0, 'projects' => 0, 'sanctioned_amount' => 0.0, 'expenditure' => 0.0, 'volunteers' => 0, 'booths' => 0, 'registered_voters' => 0];
    }

    private function boothReport(Collection $villages): array
    {
        $booths = PollingBooth::with('ward.village.mandal.assemblyConstituency.constituency')
            ->whereHas('ward', fn (Builder $wards) => $wards->whereIn('village_id', $villages->pluck('id')))
            ->where('is_active', true)->orderBy('booth_number')->get();
        $ids = $booths->pluck('id');
        $citizens = CitizenAddress::whereIn('polling_booth_id', $ids)->selectRaw('polling_booth_id, COUNT(DISTINCT citizen_id) AS aggregate')->groupBy('polling_booth_id')->pluck('aggregate', 'polling_booth_id');
        $families = Family::whereIn('polling_booth_id', $ids)->selectRaw('polling_booth_id, COUNT(*) AS aggregate')->groupBy('polling_booth_id')->pluck('aggregate', 'polling_booth_id');
        $grievances = Grievance::whereIn('polling_booth_id', $ids)->selectRaw('polling_booth_id, COUNT(*) AS aggregate')->groupBy('polling_booth_id')->pluck('aggregate', 'polling_booth_id');
        $pending = Grievance::whereIn('polling_booth_id', $ids)->whereNotIn('status', ['resolved', 'closed'])->selectRaw('polling_booth_id, COUNT(*) AS aggregate')->groupBy('polling_booth_id')->pluck('aggregate', 'polling_booth_id');
        $rows = $booths->map(function (PollingBooth $booth) use ($citizens, $families, $grievances, $pending) {
            $metrics = $this->emptyMetrics();
            $metrics['citizens'] = (int) ($citizens[$booth->id] ?? 0); $metrics['families'] = (int) ($families[$booth->id] ?? 0);
            $metrics['grievances'] = (int) ($grievances[$booth->id] ?? 0); $metrics['pending_grievances'] = (int) ($pending[$booth->id] ?? 0);
            $metrics['booths'] = 1; $metrics['registered_voters'] = $booth->total_voters;
            return ['id' => $booth->id, 'name' => $booth->name, 'parent_name' => $booth->ward?->village?->name, 'village_count' => 1, 'metrics' => $this->withRates($metrics)];
        });
        $totals = $this->emptyMetrics(); foreach ($rows as $row) $totals = $this->add($totals, $row['metrics']);
        return ['level' => 'booth', 'generated_at' => now()->toIso8601String(), 'definitions' => ['citizens' => 'Distinct citizens assigned to the polling booth.', 'registered_voters' => 'Official total_voters stored for active polling booths.'], 'totals' => $this->withRates($totals), 'data' => $rows];
    }

    private function add(array $left, array $right): array
    {
        foreach ($left as $key => $value) $left[$key] = $value + $right[$key];
        return $left;
    }

    private function withRates(array $metrics): array
    {
        $metrics['budget_utilization'] = $metrics['sanctioned_amount'] > 0 ? round($metrics['expenditure'] * 100 / $metrics['sanctioned_amount'], 2) : null;
        $metrics['grievance_resolution_rate'] = $metrics['grievances'] > 0 ? round(($metrics['grievances'] - $metrics['pending_grievances']) * 100 / $metrics['grievances'], 2) : null;
        return $metrics;
    }
}
