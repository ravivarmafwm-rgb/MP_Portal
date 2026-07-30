<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Family;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Services\GeographicScopeService;

class FamilyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Family::with(['village.mandal', 'familyMembers.citizen'])
            ->withSum('schemeBeneficiaries as total_benefits_received', 'total_benefit_received');
        app(GeographicScopeService::class)->apply($query, $request->user());

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('family_id', 'ilike', "%$search%")
                  ->orWhere('head_of_family_name', 'ilike', "%$search%");
            });
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $results = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'data' => $results->items(),
            'meta' => [
                'total'        => $results->total(),
                'per_page'     => $results->perPage(),
                'current_page' => $results->currentPage(),
                'last_page'    => $results->lastPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'head_of_family_name' => 'required|string|max:150',
            'village_id'          => 'nullable|uuid|exists:villages,id',
            'ward_id'             => 'nullable|uuid|exists:wards,id',
            'house_number'        => 'nullable|string|max:50',
            'street'              => 'nullable|string|max:150',
        ]);

        $family = Family::create([
            'family_id'           => 'FAM' . strtoupper(Str::random(8)),
            'head_of_family_name' => $data['head_of_family_name'],
            'village_id'          => $data['village_id'] ?? null,
            'ward_id'             => $data['ward_id'] ?? null,
            'house_number'        => $data['house_number'] ?? null,
            'street'              => $data['street'] ?? null,
            'members_count'       => 0,
            'created_by'          => $request->user()->id,
        ]);

        return response()->json($family->load(['village', 'familyMembers']), 201);
    }
}
