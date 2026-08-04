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
use App\Http\Requests\Scheme\StoreCitizenSchemeApplicationRequest;
use App\Http\Requests\Scheme\ReviewSchemeApplicationRequest;
use App\Services\SchemeEligibilityService;
use App\Services\SchemeApplicationService;
use App\Services\NotificationService;
use App\Models\User;
use Illuminate\Support\Str;
use App\Http\Requests\Scheme\StoreBenefitDisbursementRequest;
use App\Http\Requests\Scheme\TransitionBenefitDisbursementRequest;
use App\Models\BenefitDisbursement;
use App\Services\BenefitDisbursementService;
use App\Http\Requests\Scheme\SaveSchemeEligibilityRuleRequest;
use App\Models\SchemeEligibilityRule;
use App\Http\Requests\Scheme\SaveSchemeRequiredDocumentRequest;
use App\Http\Requests\Scheme\UploadSchemeApplicationDocumentRequest;
use App\Http\Requests\Scheme\ReviewSchemeApplicationDocumentRequest;
use App\Models\SchemeRequiredDocument;
use App\Models\SchemeApplicationDocumentReview;
use App\Services\SchemeDocumentService;
use App\Http\Requests\Scheme\WithdrawSchemeApplicationRequest;

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
        $this->authorize('view', $application);
        $application->load([
            'scheme.department', 'citizen', 'family', 'village.mandal', 'ward', 'processedBy:id,name',
            'beneficiaries', 'benefitDisbursements', 'documents.documentCategory',
            'scheme.requiredDocuments.documentCategory',
            'documentReviews.requirement.documentCategory', 'documentReviews.document.documentCategory',
            'documentReviews.reviewedBy:id,name',
            'activityLogs' => fn ($query) => $query->with('user:id,name')->latest(),
        ]);
        return response()->json($application);
    }

    public function citizenSchemes(Request $request): JsonResponse
    {
        abort_unless($request->user()->hasRole('citizen'), 403);
        return response()->json([
            'data' => Scheme::query()
                ->where('is_active', true)
                ->whereDate('start_date', '<=', today())
                ->where(fn ($query) => $query->whereNull('end_date')->orWhereDate('end_date', '>=', today()))
                ->with([
                    'department:id,name',
                    'eligibilityRules' => fn ($query) => $query->orderBy('sort_order'),
                    'requiredDocuments' => fn ($query) => $query->where('is_active', true)->with('documentCategory:id,name,slug'),
                ])
                ->orderBy('name')
                ->get()
                ->map(fn (Scheme $scheme) => (new SchemeResource($scheme))->resolve($request)),
        ]);
    }

    public function myApplications(Request $request): JsonResponse
    {
        abort_unless($request->user()->hasRole('citizen'), 403);
        abort_unless($request->user()->citizen_id, 409, 'This account is not linked to a citizen record.');
        return response()->json([
            'data' => SchemeApplication::query()
                ->where(function ($query) use ($request) {
                    $query->where('citizen_id', $request->user()->citizen_id);
                    $familyId = \App\Models\Citizen::whereKey($request->user()->citizen_id)->value('family_id');
                    if ($familyId && \App\Models\Family::whereKey($familyId)->where('head_citizen_id', $request->user()->citizen_id)->exists()) {
                        $query->orWhere('family_id', $familyId);
                    }
                })
                ->with([
                    'scheme.department', 'scheme.requiredDocuments.documentCategory',
                    'beneficiaries', 'benefitDisbursements',
                    'documentReviews.requirement.documentCategory',
                    'documentReviews.document.documentCategory', 'createdBy:id,name', 'submittedBy:id,name',
                ])
                ->with(['activityLogs' => fn ($query) => $query->latest()->with('user:id,name')])
                ->latest('application_date')
                ->get(),
        ]);
    }

    public function applyAsCitizen(
        StoreCitizenSchemeApplicationRequest $request,
        SchemeEligibilityService $eligibilityService
    ): JsonResponse {
        abort_unless($request->user()->citizen_id, 409, 'This account is not linked to a citizen record.');
        $citizen = $this->resolveApplicationCitizen($request);
        return $this->createApplicationForCitizen($request, $citizen, $eligibilityService, 'citizen');
    }

    public function applyForCitizen(
        StoreCitizenSchemeApplicationRequest $request,
        SchemeEligibilityService $eligibilityService
    ): JsonResponse {
        abort_unless($request->user()->hasRole('volunteer'), 403);
        $citizen = $this->resolveApplicationCitizen($request);
        abort_unless(app(GeographicScopeService::class)->allows($request->user(), $citizen), 403, 'This citizen is outside your assigned geography.');
        return $this->createApplicationForCitizen($request, $citizen, $eligibilityService, 'volunteer');
    }

    private function resolveApplicationCitizen(Request $request): \App\Models\Citizen
    {
        $actor = $request->user();
        $targetId = $request->validated('target_citizen_id') ?: $actor->citizen_id;
        $citizen = \App\Models\Citizen::with('family')->findOrFail($targetId);
        if ($actor->hasRole('citizen')) {
            $isSelf = $actor->citizen_id === $citizen->id;
            $isFamilyHead = $actor->citizen_id !== null && $citizen->family_id !== null
                && $citizen->family_id === \App\Models\Citizen::whereKey($actor->citizen_id)->value('family_id')
                && \App\Models\Family::whereKey($citizen->family_id)->where('head_citizen_id', $actor->citizen_id)->exists();
            abort_unless($isSelf || $isFamilyHead, 403, 'Citizens can submit only for themselves or their own family members as the family head.');
        }
        return $citizen;
    }

    private function createApplicationForCitizen(
        StoreCitizenSchemeApplicationRequest $request,
        \App\Models\Citizen $citizen,
        SchemeEligibilityService $eligibilityService,
        string $source
    ): JsonResponse {
        abort_unless($citizen->mobile_number, 409, 'A verified mobile number is required before applying.');
        $address = $citizen->addresses()->orderByDesc('is_primary')->latest()->first();
        abort_unless($address?->village_id, 409, 'A verified village address is required before applying.');
        $scheme = Scheme::with('eligibilityRules')->where('is_active', true)
            ->whereDate('start_date', '<=', today())
            ->where(fn ($query) => $query->whereNull('end_date')->orWhereDate('end_date', '>=', today()))
            ->findOrFail($request->validated('scheme_id'));
        abort_if(SchemeApplication::where('scheme_id', $scheme->id)
            ->where('citizen_id', $citizen->id)
            ->whereNotIn('status', ['rejected', 'withdrawn'])->exists(), 409, 'An active application already exists for this scheme.');
        $eligibility = $eligibilityService->evaluate($scheme, $citizen);
        abort_unless($eligibility['eligible'], 422, 'The verified citizen profile does not satisfy all mandatory eligibility rules.');
        $data = $request->validated();

        $application = DB::transaction(function () use ($request, $citizen, $address, $scheme, $eligibility, $data, $source) {
            $application = SchemeApplication::create([
                'application_number' => 'SCH'.now()->format('ymd').strtoupper(Str::random(6)),
                'scheme_id' => $scheme->id, 'citizen_id' => $citizen->id, 'family_id' => $citizen->family_id,
                'applicant_name' => trim("{$citizen->first_name} {$citizen->last_name}"),
                'applicant_mobile' => $citizen->mobile_number, 'applicant_email' => $citizen->email,
                'village_id' => $address->village_id, 'ward_id' => $address->ward_id,
                'status' => 'submitted', 'application_date' => today(),
                'remarks' => $data['remarks'] ?? null,
                'created_by' => $request->user()->id,
                'submitted_by' => $request->user()->id, 'application_source' => $source,
            ]);
            ActivityLog::create([
                'user_id' => $request->user()->id, 'loggable_type' => SchemeApplication::class,
                'loggable_id' => $application->id, 'action' => 'application_submitted',
                'module' => 'schemes', 'description' => ucfirst($source)." submitted {$application->application_number} for {$citizen->unique_id}.",
                'new_values' => ['scheme_id' => $scheme->id, 'eligibility' => $eligibility],
                'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            ]);
            return $application;
        });
        $scope = app(GeographicScopeService::class);
        User::query()->where('is_active', true)
            ->whereHas('role.permissions', fn ($permissions) => $permissions->where('slug', 'schemes.manage'))
            ->get()->filter(fn (User $recipient) => $scope->allows($recipient, $application))
            ->each(fn (User $recipient) => NotificationService::notifyUser(
                $recipient, 'Scheme Application Submitted',
                "{$application->application_number}: {$scheme->name}",
                'scheme', "/schemes/application-detail?id={$application->id}", $application
            ));

        return response()->json($application->fresh(['scheme.department', 'citizen', 'createdBy:id,name', 'submittedBy:id,name']), 201);
    }

    public function reviewApplication(
        ReviewSchemeApplicationRequest $request,
        SchemeApplication $application,
        SchemeApplicationService $service
    ): JsonResponse {
        $this->authorize('review', $application);
        return response()->json($service->review(
            $application, $request->validated(), $request->user(),
            $request->ip(), $request->userAgent()
        ));
    }

    public function withdrawApplication(
        WithdrawSchemeApplicationRequest $request,
        SchemeApplication $application,
        SchemeApplicationService $service
    ): JsonResponse {
        $this->authorize('withdraw', $application);
        return response()->json($service->withdraw(
            $application, $request->validated('reason'), $request->user(),
            $request->ip(), $request->userAgent()
        ));
    }

    public function storeDisbursement(
        StoreBenefitDisbursementRequest $request,
        SchemeApplication $application,
        BenefitDisbursementService $service
    ): JsonResponse {
        $this->authorize('review', $application);
        return response()->json($service->create(
            $application, $request->validated(), $request->user(),
            $request->ip(), $request->userAgent()
        ), 201);
    }

    public function transitionDisbursement(
        TransitionBenefitDisbursementRequest $request,
        BenefitDisbursement $disbursement,
        BenefitDisbursementService $service
    ): JsonResponse {
        $application = $disbursement->application()->firstOrFail();
        $this->authorize('review', $application);
        return response()->json($service->transition(
            $disbursement, $request->validated(), $request->user(),
            $request->ip(), $request->userAgent()
        ));
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

    public function storeEligibilityRule(
        SaveSchemeEligibilityRuleRequest $request,
        Scheme $scheme
    ): JsonResponse {
        $this->authorize('update', $scheme);
        $rule = DB::transaction(function () use ($request, $scheme) {
            $rule = $scheme->eligibilityRules()->create([
                ...$request->validated(),
                'rule_type' => 'profile',
                'condition' => null,
                'created_by' => $request->user()->id,
            ]);
            $this->audit($request, $scheme, 'eligibility_rule_created', null, $rule->getAttributes());
            return $rule;
        });
        return response()->json($rule, 201);
    }

    public function updateEligibilityRule(
        SaveSchemeEligibilityRuleRequest $request,
        Scheme $scheme,
        SchemeEligibilityRule $eligibilityRule
    ): JsonResponse {
        $this->authorize('update', $scheme);
        abort_unless($eligibilityRule->scheme_id === $scheme->id, 404);
        $old = $eligibilityRule->getAttributes();
        DB::transaction(function () use ($request, $scheme, $eligibilityRule, $old) {
            $eligibilityRule->update([
                ...$request->validated(),
                'rule_type' => 'profile',
                'condition' => null,
                'updated_by' => $request->user()->id,
            ]);
            $this->audit($request, $scheme, 'eligibility_rule_updated', $old, $eligibilityRule->fresh()->getAttributes());
        });
        return response()->json($eligibilityRule->fresh());
    }

    public function destroyEligibilityRule(
        Request $request,
        Scheme $scheme,
        SchemeEligibilityRule $eligibilityRule
    ): JsonResponse {
        $this->authorize('update', $scheme);
        abort_unless($eligibilityRule->scheme_id === $scheme->id, 404);
        DB::transaction(function () use ($request, $scheme, $eligibilityRule) {
            $old = $eligibilityRule->getAttributes();
            $eligibilityRule->update(['updated_by' => $request->user()->id]);
            $eligibilityRule->delete();
            $this->audit($request, $scheme, 'eligibility_rule_deleted', $old, null);
        });
        return response()->json(null, 204);
    }

    public function storeRequiredDocument(
        SaveSchemeRequiredDocumentRequest $request,
        Scheme $scheme
    ): JsonResponse {
        $this->authorize('update', $scheme);
        $requirement = DB::transaction(function () use ($request, $scheme) {
            $requirement = $scheme->requiredDocuments()->create([
                ...$request->validated(), 'created_by' => $request->user()->id,
            ]);
            $this->audit($request, $scheme, 'required_document_created', null, $requirement->getAttributes());
            return $requirement;
        });
        return response()->json($requirement->load('documentCategory:id,name,slug'), 201);
    }

    public function updateRequiredDocument(
        SaveSchemeRequiredDocumentRequest $request,
        Scheme $scheme,
        SchemeRequiredDocument $requiredDocument
    ): JsonResponse {
        $this->authorize('update', $scheme);
        abort_unless($requiredDocument->scheme_id === $scheme->id, 404);
        $old = $requiredDocument->getAttributes();
        DB::transaction(function () use ($request, $scheme, $requiredDocument, $old) {
            $requiredDocument->update([...$request->validated(), 'updated_by' => $request->user()->id]);
            $this->audit($request, $scheme, 'required_document_updated', $old, $requiredDocument->fresh()->getAttributes());
        });
        return response()->json($requiredDocument->fresh()->load('documentCategory:id,name,slug'));
    }

    public function destroyRequiredDocument(
        Request $request,
        Scheme $scheme,
        SchemeRequiredDocument $requiredDocument
    ): JsonResponse {
        $this->authorize('update', $scheme);
        abort_unless($requiredDocument->scheme_id === $scheme->id, 404);
        DB::transaction(function () use ($request, $scheme, $requiredDocument) {
            $old = $requiredDocument->getAttributes();
            $requiredDocument->update(['updated_by' => $request->user()->id, 'is_active' => false]);
            $requiredDocument->delete();
            $this->audit($request, $scheme, 'required_document_deleted', $old, null);
        });
        return response()->json(null, 204);
    }

    public function uploadApplicationDocument(
        UploadSchemeApplicationDocumentRequest $request,
        SchemeApplication $application,
        SchemeDocumentService $service
    ): JsonResponse {
        $this->authorize('view', $application);
        $requirement = SchemeRequiredDocument::findOrFail($request->validated('requirement_id'));
        return response()->json($service->upload(
            $application, $requirement, $request->file('file'), $request->validated(),
            $request->user(), $request->ip(), $request->userAgent()
        ), 201);
    }

    public function reviewApplicationDocument(
        ReviewSchemeApplicationDocumentRequest $request,
        SchemeApplicationDocumentReview $documentReview,
        SchemeDocumentService $service
    ): JsonResponse {
        $this->authorize('review', $documentReview->application()->firstOrFail());
        return response()->json($service->review(
            $documentReview, $request->validated(), $request->user(),
            $request->ip(), $request->userAgent()
        ));
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
        if ($user->hasRole(['super-admin', 'mp'])) return;
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
