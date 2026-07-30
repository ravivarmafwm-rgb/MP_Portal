<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchemeRequest;
use App\Http\Requests\UpdateSchemeRequest;
use App\Http\Resources\SchemeResource;
use App\Models\ActivityLog;
use App\Models\Scheme;
use App\Models\SchemeApplication;
use App\Models\SchemeBeneficiary;
use App\Services\GeographicScopeService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SchemeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Scheme::class);
        $query = Scheme::with('department')->withCount(['applications', 'beneficiaries']);
        if ($search = trim((string) $request->get('search'))) {
            $query->where(fn (Builder $q) => $q->where('name', 'ilike', "%{$search}%")->orWhere('code', 'ilike', "%{$search}%"));
        }
        if ($category = $request->get('category')) $query->where('category', $category);
        if ($department = $request->get('department_id')) $query->where('department_id', $department);
        if ($request->has('is_active')) $query->where('is_active', $request->boolean('is_active'));
        elseif ($request->boolean('active_only')) $query->where('is_active', true);

        $results = $query->orderBy('name')->paginate($this->perPage($request));
        return response()->json([
            'data' => SchemeResource::collection($results->getCollection())->resolve($request),
            'meta' => $this->meta($results),
        ]);
    }

    public function show(Request $request, Scheme $scheme): JsonResponse
    {
        $this->authorize('view', $scheme);
        $scheme->load(['department', 'eligibilityRules' => fn ($q) => $q->orderBy('sort_order')])
            ->loadCount(['applications', 'beneficiaries']);
        return response()->json((new SchemeResource($scheme))->resolve($request));
    }

    public function store(StoreSchemeRequest $request): JsonResponse
    {
        $scheme = DB::transaction(function () use ($request) {
            $scheme = Scheme::create($request->safe()->merge(['created_by' => $request->user()->id])->all());
            $this->audit($request, $scheme, 'created', null, $scheme->getAttributes());
            return $scheme;
        });
        return response()->json((new SchemeResource($scheme->load('department')))->resolve($request), 201);
    }

    public function update(UpdateSchemeRequest $request, Scheme $scheme): JsonResponse
    {
        $old = $scheme->getAttributes();
        DB::transaction(function () use ($request, $scheme, $old) {
            $scheme->update($request->safe()->merge(['updated_by' => $request->user()->id])->all());
            $this->audit($request, $scheme, 'updated', $old, $scheme->fresh()->getAttributes());
        });
        return response()->json((new SchemeResource($scheme->fresh()->load('department')))->resolve($request));
    }

    public function destroy(Request $request, Scheme $scheme): JsonResponse
    {
        $this->authorize('delete', $scheme);
        if ($scheme->applications()->exists() || $scheme->beneficiaries()->exists()) {
            return response()->json(['message' => 'A scheme with applications or beneficiaries cannot be deleted. Deactivate it instead.'], 409);
        }
        DB::transaction(function () use ($request, $scheme) {
            $this->audit($request, $scheme, 'deleted', $scheme->getAttributes(), null);
            $scheme->delete();
        });
        return response()->json(null, 204);
    }

    public function applications(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Scheme::class);
        $query = SchemeApplication::with(['scheme.department', 'citizen', 'village.mandal']);
        app(GeographicScopeService::class)->apply($query, $request->user());
        if ($schemeId = $request->get('scheme_id')) $query->where('scheme_id', $schemeId);
        if ($status = $request->get('status')) $query->where('status', $status);
        if ($search = trim((string) $request->get('search'))) {
            $query->where(fn (Builder $q) => $q->where('application_number', 'ilike', "%{$search}%")
                ->orWhere('applicant_name', 'ilike', "%{$search}%")->orWhere('applicant_mobile', 'ilike', "%{$search}%")
                ->orWhereHas('scheme', fn (Builder $s) => $s->where('name', 'ilike', "%{$search}%")));
        }
        $results = $query->orderByDesc('application_date')->paginate($this->perPage($request));
        return response()->json(['data' => $results->items(), 'meta' => $this->meta($results)]);
    }

    public function beneficiaries(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Scheme::class);
        $query = SchemeBeneficiary::with(['scheme.department', 'citizen.family.village.mandal', 'application.village.mandal']);
        if ($schemeId = $request->get('scheme_id')) $query->where('scheme_id', $schemeId);
        if ($status = $request->get('status')) $query->where('status', $status);
        if ($search = trim((string) $request->get('search'))) $query->where('beneficiary_name', 'ilike', "%{$search}%");
        $this->scopeBeneficiaries($query, $request);
        $results = $query->orderByDesc('enrollment_date')->paginate($this->perPage($request));
        return response()->json(['data' => $results->items(), 'meta' => $this->meta($results)]);
    }

    public function showApplication(Request $request, SchemeApplication $application): JsonResponse
    {
        $this->authorize('viewAny', Scheme::class);
        if (!app(GeographicScopeService::class)->allows($request->user(), $application)) {
            abort(403, 'This application is outside your assigned geographic scope.');
        }
        $application->load([
            'scheme.department', 'citizen', 'family', 'village.mandal', 'ward', 'processedBy:id,name',
            'beneficiaries', 'benefitDisbursements', 'documents.category',
            'activityLogs' => fn ($query) => $query->with('user:id,name')->latest(),
        ]);
        return response()->json($application);
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Scheme::class);
        $applications = SchemeApplication::query();
        app(GeographicScopeService::class)->apply($applications, $request->user());
        $beneficiaries = SchemeBeneficiary::query();
        $this->scopeBeneficiaries($beneficiaries, $request);
        return response()->json([
            'total_schemes' => Scheme::count(), 'active_schemes' => Scheme::where('is_active', true)->count(),
            'total_applications' => (clone $applications)->count(),
            'approved' => (clone $applications)->where('status', 'approved')->count(),
            'pending' => (clone $applications)->whereIn('status', ['pending', 'submitted', 'under_review', 'verification_pending'])->count(),
            'rejected' => (clone $applications)->where('status', 'rejected')->count(),
            'total_beneficiaries' => (clone $beneficiaries)->where('status', 'active')->count(),
            'total_benefit_distributed' => (float) (clone $beneficiaries)->sum('total_benefit_received'),
        ]);
    }

    public function eligibilityRules(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Scheme::class);
        $schemes = Scheme::query()->where('is_active', true)->with([
            'department:id,name',
            'eligibilityRules' => fn ($query) => $query->orderBy('sort_order'),
        ])->orderBy('name')->get();

        return response()->json([
            'data' => SchemeResource::collection($schemes)->resolve($request),
        ]);
    }

    public function analytics(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Scheme::class);
        $applications = SchemeApplication::query();
        app(GeographicScopeService::class)->apply($applications, $request->user());
        $beneficiaries = SchemeBeneficiary::query();
        $this->scopeBeneficiaries($beneficiaries, $request);

        $byScheme = (clone $beneficiaries)->select('scheme_id', DB::raw('COUNT(*) AS beneficiaries'), DB::raw('COALESCE(SUM(total_benefit_received), 0) AS distributed'))
            ->groupBy('scheme_id')->with('scheme:id,name,code,department_id')->get();
        $byVillage = (clone $applications)->whereNotNull('village_id')->select('village_id', DB::raw('COUNT(*) AS applications'), DB::raw("COUNT(*) FILTER (WHERE status = 'approved') AS approved"))
            ->groupBy('village_id')->with('village.mandal')->orderByDesc('applications')->limit(25)->get();
        $byDepartment = (clone $applications)->join('schemes', 'schemes.id', '=', 'scheme_applications.scheme_id')
            ->leftJoin('departments', 'departments.id', '=', 'schemes.department_id')
            ->select('departments.id', 'departments.name', DB::raw('COUNT(*) AS applications'), DB::raw("COUNT(*) FILTER (WHERE scheme_applications.status = 'approved') AS approved"))
            ->groupBy('departments.id', 'departments.name')->orderByDesc('applications')->get();

        return response()->json(['by_scheme' => $byScheme, 'by_village' => $byVillage, 'by_department' => $byDepartment]);
    }

    private function scopeBeneficiaries(Builder $query, Request $request): void
    {
        $user = $request->user();
        if ($user->hasRole(['super-admin', 'mp']) || (!$user->constituency_id && !$user->assembly_constituency_id && !$user->mandal_id && !$user->village_id && !$user->ward_id)) return;
        $query->whereHas('application', fn (Builder $application) => app(GeographicScopeService::class)->apply($application, $user));
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->get('per_page', 20), 1), 100);
    }

    private function meta($results): array
    {
        return ['total' => $results->total(), 'per_page' => $results->perPage(), 'current_page' => $results->currentPage(), 'last_page' => $results->lastPage()];
    }

    private function audit(Request $request, Scheme $scheme, string $action, ?array $old, ?array $new): void
    {
        ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Scheme::class, 'loggable_id' => $scheme->id,
            'action' => $action, 'module' => 'schemes', 'description' => "Scheme {$action}", 'old_values' => $old,
            'new_values' => $new, 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
    }
}
