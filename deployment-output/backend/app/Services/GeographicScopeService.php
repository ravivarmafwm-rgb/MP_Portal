<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use App\Models\Village;

class GeographicScopeService
{
    public function apply(Builder $query, User $user): Builder
    {
        if ($user->hasRole(['super-admin', 'mp'])) return $query;
        if (!$this->hasAssignedScope($user)) return $query->whereRaw('1 = 0');
        $model = $query->getModel();
        if (method_exists($model, 'addresses')) {
            if ($user->ward_id) return $query->whereHas('addresses', fn (Builder $addresses) => $addresses->where('ward_id', $user->ward_id));
            if ($user->village_id) return $query->whereHas('addresses', fn (Builder $addresses) => $addresses->where('village_id', $user->village_id));
            if ($user->mandal_id) return $query->whereHas('addresses.village', fn (Builder $villages) => $villages->where('mandal_id', $user->mandal_id));
            if ($user->assembly_constituency_id) return $query->whereHas('addresses.village.mandal', fn (Builder $mandals) => $mandals->where('assembly_constituency_id', $user->assembly_constituency_id));
            if ($user->constituency_id) return $query->whereHas('addresses.village.mandal.assemblyConstituency', fn (Builder $assemblies) => $assemblies->where('constituency_id', $user->constituency_id));
        }
        if ($user->ward_id && $model->isFillable('ward_id')) return $query->where($model->qualifyColumn('ward_id'), $user->ward_id);
        if ($user->village_id && $model->isFillable('village_id')) return $query->where($model->qualifyColumn('village_id'), $user->village_id);
        if ($user->mandal_id) {
            if ($model->isFillable('mandal_id')) return $query->where($model->qualifyColumn('mandal_id'), $user->mandal_id);
            if (method_exists($model, 'village')) return $query->whereHas('village', fn (Builder $village) => $village->where('mandal_id', $user->mandal_id));
        }
        if ($user->assembly_constituency_id) {
            if ($model->isFillable('assembly_constituency_id')) return $query->where($model->qualifyColumn('assembly_constituency_id'), $user->assembly_constituency_id);
            if (method_exists($model, 'village')) return $query->whereHas('village.mandal', fn (Builder $mandal) => $mandal->where('assembly_constituency_id', $user->assembly_constituency_id));
        }
        if ($user->constituency_id) {
            if ($model->isFillable('constituency_id')) return $query->where($model->qualifyColumn('constituency_id'), $user->constituency_id);
            if (method_exists($model, 'village')) return $query->whereHas('village.mandal.assemblyConstituency', fn (Builder $assembly) => $assembly->where('constituency_id', $user->constituency_id));
        }
        return $query->whereRaw('1 = 0');
    }

    public function allows(User $user, Model $model): bool
    {
        return $this->apply($model->newQuery()->whereKey($model->getKey()), $user)->exists();
    }

    public function allowsVillage(User $user, ?string $villageId, ?string $wardId = null): bool
    {
        if ($user->hasRole(['super-admin', 'mp'])) return true;
        if (!$villageId || !$this->hasAssignedScope($user)) return false;
        $query = Village::whereKey($villageId);
        if ($user->village_id) $query->whereKey($user->village_id);
        elseif ($user->mandal_id) $query->where('mandal_id', $user->mandal_id);
        elseif ($user->assembly_constituency_id) $query->whereHas('mandal', fn (Builder $mandal) => $mandal->where('assembly_constituency_id', $user->assembly_constituency_id));
        elseif ($user->constituency_id) $query->whereHas('mandal.assemblyConstituency', fn (Builder $assembly) => $assembly->where('constituency_id', $user->constituency_id));
        if ($user->ward_id && $wardId !== $user->ward_id) return false;
        return $query->exists();
    }

    public function allowsHierarchicalResource(User $user, Model $model): bool
    {
        if ($user->hasRole(['super-admin', 'mp'])) return true;
        if (!$this->hasAssignedScope($user)) return false;
        if ($user->ward_id && !$user->village_id) return false;
        $userScope = ['constituency_id'=>$user->constituency_id,'assembly_constituency_id'=>$user->assembly_constituency_id,'mandal_id'=>$user->mandal_id,'village_id'=>$user->village_id];
        if ($user->village_id) { $village=Village::with('mandal.assemblyConstituency')->find($user->village_id); $userScope['mandal_id']??=$village?->mandal_id; $userScope['assembly_constituency_id']??=$village?->mandal?->assembly_constituency_id; $userScope['constituency_id']??=$village?->mandal?->assemblyConstituency?->constituency_id; }
        elseif ($user->mandal_id) { $mandal=\App\Models\Mandal::with('assemblyConstituency')->find($user->mandal_id); $userScope['assembly_constituency_id']??=$mandal?->assembly_constituency_id; $userScope['constituency_id']??=$mandal?->assemblyConstituency?->constituency_id; }
        elseif ($user->assembly_constituency_id) { $assembly=\App\Models\AssemblyConstituency::find($user->assembly_constituency_id); $userScope['constituency_id']??=$assembly?->constituency_id; }
        $resource = [
            'constituency_id' => $model->getAttribute('constituency_id'),
            'assembly_constituency_id' => $model->getAttribute('assembly_constituency_id'),
            'mandal_id' => $model->getAttribute('mandal_id'),
            'village_id' => $model->getAttribute('village_id'),
        ];
        foreach (['constituency_id', 'assembly_constituency_id', 'mandal_id', 'village_id'] as $field) {
            if ($userScope[$field] && $userScope[$field] !== $resource[$field]) return false;
        }
        if ($user->ward_id && $resource['village_id'] && $user->village_id !== $resource['village_id']) return false;
        return true;
    }

    public function applyHierarchicalResources(Builder $query, User $user): Builder
    {
        if ($user->hasRole(['super-admin','mp'])) return $query;
        if (!$this->hasAssignedScope($user)) return $query->whereRaw('1 = 0');
        if ($user->ward_id && !$user->village_id) return $query->whereRaw('1 = 0');
        $scope=['constituency_id'=>$user->constituency_id,'assembly_constituency_id'=>$user->assembly_constituency_id,'mandal_id'=>$user->mandal_id,'village_id'=>$user->village_id];
        if($user->village_id){$v=Village::with('mandal.assemblyConstituency')->find($user->village_id);$scope['mandal_id']??=$v?->mandal_id;$scope['assembly_constituency_id']??=$v?->mandal?->assembly_constituency_id;$scope['constituency_id']??=$v?->mandal?->assemblyConstituency?->constituency_id;}
        elseif($user->mandal_id){$m=\App\Models\Mandal::with('assemblyConstituency')->find($user->mandal_id);$scope['assembly_constituency_id']??=$m?->assembly_constituency_id;$scope['constituency_id']??=$m?->assemblyConstituency?->constituency_id;}
        elseif($user->assembly_constituency_id){$a=\App\Models\AssemblyConstituency::find($user->assembly_constituency_id);$scope['constituency_id']??=$a?->constituency_id;}
        foreach($scope as$field=>$value)if($value)$query->where($field,$value);return$query;
    }

    private function hasAssignedScope(User $user): bool
    {
        return (bool) ($user->constituency_id || $user->assembly_constituency_id || $user->mandal_id || $user->village_id || $user->ward_id);
    }
}
