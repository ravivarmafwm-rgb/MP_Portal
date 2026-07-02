<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Constituency;
use App\Models\AssemblyConstituency;
use App\Models\Mandal;
use App\Models\Village;
use App\Models\Ward;
use App\Models\PollingBooth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function constituencies(): JsonResponse
    {
        return response()->json(Constituency::where('is_active', true)->get());
    }

    public function assemblyConstituencies(Request $request): JsonResponse
    {
        $query = AssemblyConstituency::where('is_active', true);
        if ($id = $request->get('constituency_id')) {
            $query->where('constituency_id', $id);
        }
        return response()->json($query->orderBy('name')->get());
    }

    public function mandals(Request $request): JsonResponse
    {
        $query = Mandal::where('is_active', true);
        if ($id = $request->get('assembly_constituency_id')) {
            $query->where('assembly_constituency_id', $id);
        }
        return response()->json($query->orderBy('name')->get());
    }

    public function villages(Request $request): JsonResponse
    {
        $query = Village::where('is_active', true);
        if ($id = $request->get('mandal_id')) {
            $query->where('mandal_id', $id);
        }
        return response()->json($query->orderBy('name')->get());
    }

    public function wards(Request $request): JsonResponse
    {
        $query = Ward::where('is_active', true);
        if ($id = $request->get('village_id')) {
            $query->where('village_id', $id);
        }
        return response()->json($query->orderBy('ward_number')->get());
    }

    public function pollingBooths(Request $request): JsonResponse
    {
        $query = PollingBooth::where('is_active', true);
        if ($id = $request->get('ward_id')) {
            $query->where('ward_id', $id);
        }
        if ($villageId = $request->get('village_id')) {
            $wardIds = Ward::where('village_id', $villageId)->pluck('id');
            $query->whereIn('ward_id', $wardIds);
        }
        return response()->json($query->orderBy('booth_number')->get());
    }
}
