<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Family\SaveFamilyMemberRequest;
use App\Http\Requests\Family\StoreFamilyRequest;
use App\Http\Requests\Family\UpdateFamilyRequest;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Services\FamilyService;
use App\Services\GeographicScopeService;
use App\Http\Resources\FamilyResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FamilyController extends Controller
{
    public function __construct(private readonly FamilyService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Family::class);
        $query = Family::with(['village.mandal', 'ward', 'familyMembers.citizen', 'activityLogs.user:id,name'])
            ->withSum('schemeBeneficiaries as total_benefits_received', 'total_benefit_received');
        app(GeographicScopeService::class)->apply($query, $request->user());
        if ($search = trim((string) $request->get('search'))) {
            $query->where(fn ($q) => $q->where('family_id', 'ilike', "%{$search}%")
                ->orWhere('head_of_family_name', 'ilike', "%{$search}%")
                ->orWhereHas('familyMembers.citizen', fn ($c) => $c->where('first_name', 'ilike', "%{$search}%")
                    ->orWhere('last_name', 'ilike', "%{$search}%")
                    ->orWhere('mobile_number', 'ilike', "%{$search}%")));
        }
        if ($village = $request->get('village_id')) $query->where('village_id', $village);
        if ($bpl = $request->get('is_bpl')) $query->where('is_bpl', filter_var($bpl, FILTER_VALIDATE_BOOLEAN));
        $results = $query->orderByDesc('created_at')->paginate(min(max((int) $request->get('per_page', 20), 1), 100));
        return response()->json(['data' => FamilyResource::collection($results->getCollection())->resolve(), 'meta' => [
            'total' => $results->total(), 'per_page' => $results->perPage(),
            'current_page' => $results->currentPage(), 'last_page' => $results->lastPage(),
        ]]);
    }

    public function show(Family $family): JsonResponse
    {
        $this->authorize('view', $family);
        return response()->json((new FamilyResource($family->load(['village.mandal', 'ward', 'pollingBooth', 'familyMembers.citizen', 'activityLogs.user:id,name'])))->resolve($request));
    }

    public function store(StoreFamilyRequest $request): JsonResponse
    {
        return response()->json((new FamilyResource($this->service->create($request->validated(), $request->user(), $request)))->resolve($request), 201);
    }

    public function update(UpdateFamilyRequest $request, Family $family): JsonResponse
    {
        return response()->json((new FamilyResource($this->service->update($family, $request->validated(), $request->user(), $request)))->resolve($request));
    }

    public function destroy(Request $request, Family $family): JsonResponse
    {
        $this->authorize('delete', $family);
        if ($family->familyMembers()->exists() || $family->schemeApplications()->exists() || $family->schemeBeneficiaries()->exists()) {
            return response()->json(['message' => 'Remove family members and linked scheme records before archiving this family.'], 409);
        }
        DB::transaction(function () use ($family, $request) {
            \App\Models\ActivityLog::create([
                'user_id' => $request->user()->id, 'loggable_type' => Family::class, 'loggable_id' => $family->id,
                'action' => 'family_archived', 'module' => 'families', 'description' => 'Family archived',
                'old_values' => $family->getAttributes(), 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            ]);
            $family->delete();
        });
        return response()->json(null, 204);
    }

    public function addMember(SaveFamilyMemberRequest $request, Family $family): JsonResponse
    {
        return response()->json($this->service->addMember($family, $request->validated(), $request->user(), $request), 201);
    }

    public function removeMember(Request $request, Family $family, FamilyMember $member): JsonResponse
    {
        $this->authorize('update', $family);
        return response()->json($this->service->removeMember($family, $member, $request->user(), $request));
    }

    public function updateMember(SaveFamilyMemberRequest $request, Family $family, FamilyMember $member): JsonResponse
    {
        return response()->json($this->service->updateMember($family, $member, $request->validated(), $request->user(), $request));
    }
}
