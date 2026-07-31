<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssemblyConstituency;
use App\Models\Citizen;
use App\Models\Grievance;
use App\Models\Mandal;
use App\Models\PollingBooth;
use App\Models\Project;
use App\Models\SchemeBeneficiary;
use App\Models\Survey;
use App\Models\Village;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MlaDashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $ac = $this->resolveAssemblyConstituency($user);

        if (! $ac) {
            return response()->json(['message' => 'No assembly constituency assigned to this MLA account.'], 404);
        }

        $mandalIds = Mandal::where('assembly_constituency_id', $ac->id)->pluck('id');
        $villageIds = Village::whereIn('mandal_id', $mandalIds)->pluck('id');

        $citizenIds = DB::table('citizen_addresses')
            ->whereIn('village_id', $villageIds)
            ->distinct()
            ->pluck('citizen_id');

        $beneficiaries = SchemeBeneficiary::whereHas('citizen', function ($q) use ($citizenIds) {
            $q->whereIn('id', $citizenIds);
        })->count();

        $grievances = Grievance::whereIn('village_id', $villageIds);
        $projects = Project::where('assembly_constituency_id', $ac->id);
        $volunteers = Volunteer::whereIn('village_id', $villageIds)->where('status', 'active');

        return response()->json([
            'greeting'       => 'Good day',
            'date_label'     => now()->format('l, j F Y'),
            'mla_name'       => $user->name,
            'assembly_name'  => $ac->name,
            'constituency'   => $ac->load('constituency')->constituency?->name,

            'kpis' => [
                'mandals'            => $mandalIds->count(),
                'villages'           => $villageIds->count(),
                'booths'             => PollingBooth::whereIn('village_id', $villageIds)->count(),
                'citizens'           => $citizenIds->count(),
                'beneficiaries'      => $beneficiaries,
                'local_grievances'   => (clone $grievances)->whereIn('status', ['open', 'assigned', 'in_progress', 'pending'])->count(),
                'resolved_grievances'=> (clone $grievances)->where('status', 'resolved')->count(),
                'local_projects'     => (clone $projects)->count(),
                'active_projects'    => (clone $projects)->where('status', 'in_progress')->count(),
                'volunteers'         => $volunteers->count(),
            ],

            'mandals' => Mandal::where('assembly_constituency_id', $ac->id)
                ->withCount('villages')
                ->get()
                ->map(fn ($m) => [
                    'id'       => $m->id,
                    'name'     => $m->name,
                    'villages' => $m->villages_count,
                ]),

            'recent_grievances' => Grievance::with(['category', 'village'])
                ->whereIn('village_id', $villageIds)
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(),

            'recent_projects' => Project::where('assembly_constituency_id', $ac->id)
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(),

            'volunteer_network' => Volunteer::with('village')
                ->whereIn('village_id', $villageIds)
                ->where('status', 'active')
                ->orderByDesc('performance_score')
                ->limit(8)
                ->get()
                ->map(fn ($v) => [
                    'name'    => trim("{$v->first_name} {$v->last_name}"),
                    'village' => $v->village?->name ?? 'N/A',
                    'score'   => (int) ($v->performance_score * 10),
                    'status'  => $v->status,
                ]),

            'surveys' => Survey::where('assembly_constituency_id', $ac->id)
                ->withCount('responses')
                ->where('status', 'active')
                ->limit(4)
                ->get(),
        ]);
    }

    private function resolveAssemblyConstituency($user): ?AssemblyConstituency
    {
        $byName = AssemblyConstituency::where('mla_name', 'ilike', '%' . $user->name . '%')->first();
        if ($byName) {
            return $byName;
        }

        return AssemblyConstituency::where('is_active', true)->orderBy('name')->first();
    }
}
