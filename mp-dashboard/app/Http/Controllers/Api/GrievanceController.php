<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grievance;
use App\Models\GrievanceCategory;
use App\Models\GrievanceFeedback;
use App\Models\Department;
use App\Models\ActivityLog;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\GeographicScopeService;
use App\Services\GrievanceAssignmentService;
use App\Http\Requests\Grievance\AssignGrievanceRequest;
use App\Models\User;
use App\Http\Requests\Grievance\EscalateGrievanceRequest;
use App\Services\GrievanceEscalationService;
use App\Http\Requests\Grievance\RespondToGrievanceAssignmentRequest;
use App\Http\Requests\Grievance\ResolveGrievanceRequest;
use App\Http\Requests\Grievance\CloseGrievanceRequest;
use App\Models\GrievanceAssignment;
use App\Services\GrievanceWorkflowService;
use App\Services\ParliamentaryAnalyticsService;
use App\Http\Requests\Grievance\UpdateGrievancePriorityRequest;
use App\Http\Requests\Grievance\SubmitCitizenGrievanceFeedbackRequest;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Grievance\StoreCitizenGrievanceRequest;
use App\Http\Requests\Grievance\StoreGrievanceRequest;
use App\Http\Requests\Grievance\ReopenGrievanceRequest;
use App\Http\Requests\Grievance\AddGrievanceNoteRequest;
use App\Http\Resources\GrievanceResource;
use App\Models\Village;
use Illuminate\Support\Str;

class GrievanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Grievance::class);
        $query = Grievance::with(['category', 'citizen', 'village', 'assignedDepartment']);
        app(GeographicScopeService::class)->apply($query, $request->user());

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'ilike', "%$search%")
                  ->orWhere('citizen_name', 'ilike', "%$search%")
                  ->orWhere('grievance_number', 'ilike', "%$search%");
            });
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }
        if ($priority = $request->get('priority')) {
            $query->where('priority', $priority);
        }
        if ($category = $request->get('category_id')) {
            $query->where('category_id', $category);
        }
        foreach (['assigned_to', 'assigned_department_id', 'source'] as $filter) {
            if ($request->filled($filter)) $query->where($filter, $request->get($filter));
        }
        if ($request->filled('due_before')) $query->whereDate('due_date', '<=', $request->date('due_before'));
        if ($request->filled('due_after')) $query->whereDate('due_date', '>=', $request->date('due_after'));

        $perPage = min((int) $request->get('per_page', 20), 100);
        $sort = in_array($request->get('sort'), ['created_at', 'due_date', 'priority', 'status', 'grievance_number'], true) ? $request->get('sort') : 'created_at';
        $direction = $request->get('direction') === 'asc' ? 'asc' : 'desc';
        $results = $query->orderBy($sort, $direction)->paginate($perPage);

        return response()->json([
            'data' => GrievanceResource::collection($results->getCollection())->resolve(),
            'meta' => [
                'total'        => $results->total(),
                'per_page'     => $results->perPage(),
                'current_page' => $results->currentPage(),
                'last_page'    => $results->lastPage(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $grievance = Grievance::with([
            'category', 'citizen', 'village', 'ward',
            'assignedTo', 'assignedDepartment',
            'assignments.assignedTo', 'assignments.assignedBy', 'assignments.department',
            'escalations',
            'updates.updatedBy',
            'feedback',
        ])->findOrFail($id);
        $this->authorize('view', $grievance);

        return response()->json(GrievanceResource::make($grievance)->resolve());
    }

    public function store(StoreGrievanceRequest $request): JsonResponse
    {
        $this->authorize('create', Grievance::class);
        $data = $request->validated();
        abort_unless(app(GeographicScopeService::class)->allowsVillage($request->user(), $data['village_id'] ?? null, $data['ward_id'] ?? null), 403, 'The selected location is outside your assigned area.');
        $grievance = DB::transaction(function () use ($request, $data) {
            $grievance = Grievance::create([
                ...$data,
                'grievance_number' => 'GRV' . str_pad(Grievance::count() + 1, 8, '0', STR_PAD_LEFT),
                'priority' => $data['priority'] ?? 'medium', 'severity' => $data['priority'] ?? 'medium',
                'status' => 'pending', 'source' => $data['source'] ?? 'portal', 'created_by' => $request->user()->id,
            ]);
            ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Grievance::class, 'loggable_id' => $grievance->id, 'action' => 'grievance_filed', 'description' => "Grievance {$grievance->grievance_number} filed: {$grievance->subject}", 'module' => 'grievances', 'new_values' => $grievance->getAttributes(), 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
            return $grievance;
        });

        NotificationService::notifyRoles(
            ['mp', 'mla', 'mp-staff', 'government-officer'],
            'New Grievance Filed',
            "Grievance {$grievance->grievance_number}: {$grievance->subject}",
            'grievance',
            '/grievances/list',
            $grievance,
            $grievance->priority === 'urgent' ? 'high' : 'normal',
        );

        return response()->json(GrievanceResource::make($grievance->fresh(['category']))->resolve(), 201);
    }

    public function update(UpdateGrievancePriorityRequest $request, string $id): JsonResponse
    {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);

        $data = $request->validated();
        $oldPriority = $grievance->priority;
        $grievance->update(array_merge($data, ['updated_by' => $request->user()->id]));
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'loggable_type' => Grievance::class,
            'loggable_id' => $grievance->id,
            'action' => 'priority_updated',
            'module' => 'grievances',
            'description' => "Priority changed from {$oldPriority} to {$grievance->priority}",
            'old_values' => ['priority' => $oldPriority],
            'new_values' => ['priority' => $grievance->priority],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json($grievance->fresh(['category', 'assignedTo', 'assignedDepartment']));
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Grievance::class);
        $base = Grievance::query();
        app(GeographicScopeService::class)->apply($base, $request->user());
        return response()->json([
            'total' => (clone $base)->count(), 'pending' => (clone $base)->where('status', 'pending')->count(),
            'assigned' => (clone $base)->where('status', 'assigned')->count(), 'in_progress' => (clone $base)->where('status', 'in_progress')->count(),
            'escalated' => (clone $base)->where('status', 'escalated')->count(), 'resolved' => (clone $base)->where('status', 'resolved')->count(),
            'closed' => (clone $base)->where('status', 'closed')->count(), 'this_week' => (clone $base)->where('created_at', '>=', now()->startOfWeek())->count(),
            'urgent' => (clone $base)->where('priority', 'urgent')->whereNotIn('status', ['resolved', 'closed'])->count(),
            'overdue' => (clone $base)->whereNotIn('status', ['resolved', 'closed'])->whereNotNull('due_date')->whereDate('due_date', '<', today())->count(),
            'unassigned' => (clone $base)->whereNull('assigned_to')->whereNotIn('status', ['resolved', 'closed'])->count(),
        ]);
    }

    public function analytics(Request $request, ParliamentaryAnalyticsService $analytics): JsonResponse
    {
        $this->authorize('viewAny', Grievance::class);

        $base = Grievance::query();
        app(GeographicScopeService::class)->apply($base, $request->user());

        $weeklyTrend = [];
        for ($offset = 7; $offset >= 0; $offset--) {
            $start = now()->startOfWeek()->subWeeks($offset);
            $end = $start->copy()->addWeek();
            $weeklyTrend[] = [
                'week' => $start->format('d M'),
                'submitted' => (clone $base)->where('created_at', '>=', $start)->where('created_at', '<', $end)->count(),
                'resolved' => (clone $base)->whereNotNull('resolved_date')->whereDate('resolved_date', '>=', $start->toDateString())->whereDate('resolved_date', '<', $end->toDateString())->count(),
            ];
        }

        $departmentRows = (clone $base)
            ->whereNotNull('assigned_department_id')
            ->selectRaw("assigned_department_id, COUNT(*) AS total, SUM(CASE WHEN status IN ('resolved', 'closed') THEN 1 ELSE 0 END) AS resolved, COUNT(due_date) AS due_count, SUM(CASE WHEN due_date IS NOT NULL AND resolved_date IS NOT NULL AND resolved_date <= due_date THEN 1 ELSE 0 END) AS within_sla")
            ->groupBy('assigned_department_id')
            ->get();
        $departments = Department::whereIn('id', $departmentRows->pluck('assigned_department_id'))->get(['id', 'name'])->keyBy('id');
        $departmentPerformance = $departmentRows->map(function ($row) use ($departments) {
            $dueCount = (int) $row->due_count;
            return [
                'id' => $row->assigned_department_id,
                'name' => $departments[$row->assigned_department_id]?->name ?? 'Unknown department',
                'total' => (int) $row->total,
                'resolved' => (int) $row->resolved,
                'sla_compliance' => $dueCount > 0 ? round(((int) $row->within_sla * 100) / $dueCount, 2) : null,
            ];
        })->sortByDesc('sla_compliance')->values();

        $assemblyReport = $analytics->report($request->user(), 'assembly');

        return response()->json([
            'weekly_trend' => $weeklyTrend,
            'assembly' => collect($assemblyReport['data'] ?? [])->map(fn (array $row) => [
                'id' => $row['id'],
                'name' => $row['name'],
                'complaints' => (int) ($row['metrics']['grievances'] ?? 0),
                'resolved' => (int) (($row['metrics']['grievances'] ?? 0) - ($row['metrics']['pending_grievances'] ?? 0)),
                'resolution_rate' => $row['metrics']['grievance_resolution_rate'] ?? null,
            ])->values(),
            'departments' => $departmentPerformance,
        ]);
    }

    public function assignmentOptions(Request $request, string $id): JsonResponse
    {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);
        $scope = app(GeographicScopeService::class);
        $officers = User::with('role:id,name,slug')
            ->where('is_active', true)
            ->whereNotNull('department_id')
            ->whereHas('role.permissions', fn ($permissions) => $permissions->where('slug', 'grievances.update'))
            ->orderBy('name')
            ->get()
            ->filter(fn (User $user) => $scope->allows($user, $grievance))
            ->values()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'department_id' => $user->department_id,
                'role' => $user->role?->name,
            ]);

        return response()->json([
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']),
            'officers' => $officers,
        ]);
    }

    public function assign(
        AssignGrievanceRequest $request,
        string $id,
        GrievanceAssignmentService $service
    ): JsonResponse {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);

        return response()->json($service->assign(
            $grievance,
            $request->validated(),
            $request->user(),
            $request->ip(),
            $request->userAgent(),
        ));
    }

    public function escalate(
        EscalateGrievanceRequest $request,
        string $id,
        GrievanceEscalationService $service
    ): JsonResponse {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);
        $target = $request->filled('escalated_to')
            ? User::findOrFail($request->validated('escalated_to'))
            : null;
        if ($target) {
            abort_unless(app(GeographicScopeService::class)->allows($target, $grievance), 422, 'The escalation target is outside this grievance geography.');
        }

        return response()->json($service->escalate(
            $grievance,
            $request->user(),
            $request->validated('reason'),
            $request->validated('description'),
            $target,
            $request->ip(),
            $request->userAgent(),
        ));
    }

    public function respondToAssignment(
        RespondToGrievanceAssignmentRequest $request,
        string $id,
        string $assignmentId,
        GrievanceWorkflowService $service
    ): JsonResponse {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);
        $assignment = GrievanceAssignment::findOrFail($assignmentId);

        return response()->json($service->respondToAssignment(
            $grievance, $assignment, $request->user(), $request->validated(),
            $request->ip(), $request->userAgent(),
        ));
    }

    public function resolve(
        ResolveGrievanceRequest $request,
        string $id,
        GrievanceWorkflowService $service
    ): JsonResponse {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);

        return response()->json($service->resolve(
            $grievance, $request->user(), $request->validated(),
            $request->ip(), $request->userAgent(),
        ));
    }

    public function close(
        CloseGrievanceRequest $request,
        string $id,
        GrievanceWorkflowService $service
    ): JsonResponse {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);

        return response()->json($service->close(
            $grievance, $request->user(), $request->validated(),
            $request->ip(), $request->userAgent(),
        ));
    }

    public function reopen(ReopenGrievanceRequest $request, string $id, GrievanceWorkflowService $service): JsonResponse
    {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);
        return response()->json($service->reopen($grievance, $request->user(), $request->validated('reason'), $request->ip(), $request->userAgent()));
    }

    public function addNote(AddGrievanceNoteRequest $request, string $id): JsonResponse
    {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);
        $note = DB::transaction(function () use ($request, $grievance) {
            $note = $grievance->updates()->create([
                'updated_by' => $request->user()->id, 'created_by' => $request->user()->id,
                'update_type' => 'internal_note', 'from_status' => $grievance->status,
                'to_status' => $grievance->status, 'remarks' => $request->validated('remarks'),
                'is_internal' => true, 'is_public' => false,
            ]);
            ActivityLog::create([
                'user_id' => $request->user()->id, 'loggable_type' => Grievance::class, 'loggable_id' => $grievance->id,
                'action' => 'internal_note_added', 'module' => 'grievances', 'description' => 'Internal grievance note added',
                'new_values' => ['update_id' => $note->id], 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            ]);
            return $note;
        });
        return response()->json($note->load('updatedBy:id,name'), 201);
    }

    public function categories(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Grievance::class);
        $cats = GrievanceCategory::withCount([
            'grievances' => fn ($query) => app(GeographicScopeService::class)->apply($query, $request->user()),
            'grievances as resolved_grievances_count' => fn ($query) => app(GeographicScopeService::class)->apply($query, $request->user())->whereIn('status', ['resolved', 'closed']),
        ])
            ->where('is_active', true)
            ->orderByDesc('grievances_count')
            ->get();

        return response()->json($cats->map(function ($category) {
            $category->resolution_rate = $category->grievances_count > 0
                ? round(($category->resolved_grievances_count / $category->grievances_count) * 100)
                : 0;
            return $category;
        }));
    }

    public function departments(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Grievance::class);
        $scoped = Grievance::query();
        app(GeographicScopeService::class)->apply($scoped, $request->user());
        $departments = Department::where('is_active', true)->orderBy('name')->get()->map(function (Department $department) use ($scoped) {
            $base = (clone $scoped)->where('assigned_department_id', $department->id);
            $assigned = (clone $base)->count();
            $resolved = (clone $base)->whereIn('status', ['resolved', 'closed'])->count();
            $onTime = (clone $base)->whereIn('status', ['resolved', 'closed'])->whereNotNull('due_date')->whereColumn('resolved_date', '<=', 'due_date')->count();
            $withDueDate = (clone $base)->whereIn('status', ['resolved', 'closed'])->whereNotNull('due_date')->whereNotNull('resolved_date')->count();
            return [
                'id' => $department->id, 'name' => $department->name, 'code' => $department->code,
                'description' => $department->description, 'contact_person' => $department->contact_person,
                'contact_email' => $department->contact_email, 'contact_phone' => $department->contact_phone,
                'assigned' => $assigned, 'pending' => (clone $base)->whereNotIn('status', ['resolved', 'closed'])->count(),
                'resolved' => $resolved, 'sla_compliance' => $withDueDate ? round($onTime * 100 / $withDueDate) : null,
            ];
        });
        return response()->json($departments);
    }

    public function feedback(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Grievance::class);
        $query = GrievanceFeedback::with(['citizen:id,first_name,last_name', 'grievance:id,grievance_number,subject,village_id,ward_id']);
        $query->whereHas('grievance', function ($grievances) use ($request) {
            app(GeographicScopeService::class)->apply($grievances, $request->user());
        });
        $results = $query->latest('feedback_date')->paginate(min(max((int) $request->get('per_page', 10), 1), 100));
        return response()->json(['data' => $results->items(), 'meta' => ['total' => $results->total(), 'per_page' => $results->perPage(), 'current_page' => $results->currentPage(), 'last_page' => $results->lastPage()]]);
    }

    public function myGrievances(Request $request): JsonResponse
    {
        abort_unless($request->user()->hasRole('citizen'), 403);
        abort_unless($request->user()->citizen_id, 409, 'This account is not linked to a citizen record.');

        return response()->json([
            'data' => Grievance::with([
                'category:id,name',
                'assignedDepartment:id,name',
                'updates' => fn ($query) => $query
                    ->where('is_public', true)
                    ->latest()
                    ->with('updatedBy:id,name'),
            ])
                ->with(['feedback' => fn ($query) => $query->where('citizen_id', $request->user()->citizen_id)])
                ->where('citizen_id', $request->user()->citizen_id)
                ->latest()
                ->get(),
        ]);
    }

    public function citizenCategories(Request $request): JsonResponse
    {
        abort_unless($request->user()->hasRole('citizen'), 403);
        return response()->json(GrievanceCategory::where('is_active', true)
            ->orderBy('sort_order')->orderBy('name')
            ->get(['id', 'name', 'description', 'sla_days']));
    }

    public function storeCitizenGrievance(StoreCitizenGrievanceRequest $request): JsonResponse
    {
        abort_unless($request->user()->hasRole('citizen'), 403);
        abort_unless($request->user()->citizen_id, 409, 'This account is not linked to a citizen record.');
        $citizen = $request->user()->citizenProfile()->firstOrFail();
        abort_unless($citizen->mobile_number, 409, 'A verified mobile number is required before filing a grievance.');
        $address = $citizen->addresses()->orderByDesc('is_primary')->latest()->first();
        abort_unless($address?->village_id, 409, 'A verified village address is required before filing a grievance.');
        $village = Village::findOrFail($address->village_id);
        $category = GrievanceCategory::where('is_active', true)->findOrFail($request->validated('category_id'));
        $data = $request->validated();

        $grievance = DB::transaction(function () use ($request, $citizen, $address, $village, $category, $data) {
            $grievance = Grievance::create([
                'grievance_number' => 'GRV'.now()->format('ymd').strtoupper(Str::random(6)),
                'category_id' => $category->id, 'citizen_id' => $citizen->id,
                'citizen_name' => trim("{$citizen->first_name} {$citizen->last_name}"),
                'citizen_mobile' => $citizen->mobile_number,
                'citizen_email' => $citizen->email,
                'village_id' => $village->id, 'ward_id' => $address->ward_id,
                'polling_booth_id' => $address->polling_booth_id,
                'subject' => $data['subject'], 'description' => $data['description'],
                'priority' => $data['priority'], 'severity' => $category->severity ?: $data['priority'],
                'status' => 'pending', 'source' => 'citizen_portal',
                'assigned_department_id' => $category->department_id,
                'due_date' => now()->addDays(max(1, (int) $category->sla_days))->toDateString(),
                'created_by' => $request->user()->id,
            ]);
            $grievance->updates()->create([
                'updated_by' => $request->user()->id, 'update_type' => 'created',
                'from_status' => null, 'to_status' => 'pending',
                'remarks' => 'Grievance filed by the verified citizen account.',
                'is_internal' => false, 'is_public' => true, 'created_by' => $request->user()->id,
            ]);
            ActivityLog::create([
                'user_id' => $request->user()->id, 'loggable_type' => Grievance::class,
                'loggable_id' => $grievance->id, 'action' => 'citizen_grievance_filed',
                'module' => 'grievances', 'description' => "Citizen filed {$grievance->grievance_number}",
                'new_values' => ['category_id' => $category->id, 'village_id' => $village->id, 'priority' => $data['priority']],
                'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            ]);
            return $grievance;
        });

        $scope = app(GeographicScopeService::class);
        User::query()
            ->where('is_active', true)
            ->whereHas('role', fn ($roles) => $roles->whereIn('slug', [
                'mp', 'mp-staff', 'constituency-coordinator', 'government-officer',
            ]))
            ->get()
            ->filter(fn (User $recipient) => $scope->allows($recipient, $grievance))
            ->each(fn (User $recipient) => NotificationService::notifyUser(
                $recipient,
                'Citizen Grievance Filed',
                "{$grievance->grievance_number}: {$grievance->subject}",
                'grievance',
                "/grievances/detail?id={$grievance->id}",
                $grievance,
                $grievance->priority === 'high' ? 'high' : 'normal',
            ));

        return response()->json([
            'id' => $grievance->id,
            'grievance_number' => $grievance->grievance_number,
            'status' => $grievance->status,
            'due_date' => $grievance->due_date?->toDateString(),
            'message' => 'Your grievance was filed successfully.',
        ], 201);
    }

    public function submitCitizenFeedback(
        SubmitCitizenGrievanceFeedbackRequest $request,
        string $id
    ): JsonResponse {
        abort_unless($request->user()->hasRole('citizen'), 403);
        abort_unless($request->user()->citizen_id, 409, 'This account is not linked to a citizen record.');
        $grievance = Grievance::whereKey($id)
            ->where('citizen_id', $request->user()->citizen_id)
            ->firstOrFail();
        abort_unless(in_array($grievance->status, ['resolved', 'closed'], true), 422, 'Feedback is available after resolution.');
        $data = $request->validated();

        $feedback = DB::transaction(function () use ($grievance, $request, $data) {
            $feedback = GrievanceFeedback::updateOrCreate(
                ['grievance_id' => $grievance->id, 'citizen_id' => $request->user()->citizen_id],
                [
                    'feedback_type' => !empty($data['reopen_requested']) ? 'reopen_request' : 'resolution',
                    'rating' => $data['rating'], 'comments' => $data['comments'],
                    'would_recommend' => $data['would_recommend'] ?? null,
                    'feedback_date' => now()->toDateString(), 'feedback_source' => 'citizen_portal',
                    'created_by' => $request->user()->id, 'updated_by' => $request->user()->id,
                ]
            );
            $oldStatus = $grievance->status;
            $grievance->update([
                'satisfaction_rating' => $data['rating'],
                'citizen_feedback' => $data['comments'],
                ...(!empty($data['reopen_requested']) ? [
                    'status' => 'in_progress', 'resolved_date' => null,
                ] : []),
                'updated_by' => $request->user()->id,
            ]);
            $remarks = !empty($data['reopen_requested'])
                ? "Citizen requested reopening: {$data['reopen_reason']}"
                : "Citizen submitted resolution feedback with rating {$data['rating']}/5.";
            $grievance->updates()->create([
                'updated_by' => $request->user()->id,
                'update_type' => !empty($data['reopen_requested']) ? 'reopened_by_citizen' : 'citizen_feedback',
                'from_status' => $oldStatus,
                'to_status' => $grievance->status,
                'remarks' => $remarks, 'is_internal' => false, 'is_public' => true,
                'created_by' => $request->user()->id,
            ]);
            ActivityLog::create([
                'user_id' => $request->user()->id, 'loggable_type' => Grievance::class,
                'loggable_id' => $grievance->id,
                'action' => !empty($data['reopen_requested']) ? 'reopened_by_citizen' : 'citizen_feedback_submitted',
                'module' => 'grievances', 'description' => $remarks,
                'new_values' => ['rating' => $data['rating'], 'reopen_requested' => (bool) ($data['reopen_requested'] ?? false)],
                'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            ]);
            if ($assignee = User::find($grievance->assigned_to)) {
                NotificationService::notifyUser($assignee, !empty($data['reopen_requested']) ? 'Citizen Reopened Grievance' : 'Citizen Feedback Received', "{$grievance->grievance_number}: {$remarks}", 'grievance', "/grievances/detail?id={$grievance->id}", $grievance, !empty($data['reopen_requested']) ? 'high' : 'normal');
            } else {
                NotificationService::notifyRoles(['mp', 'mp-staff', 'constituency-coordinator'], !empty($data['reopen_requested']) ? 'Citizen Reopened Grievance' : 'Citizen Feedback Received', "{$grievance->grievance_number}: {$remarks}", 'grievance', "/grievances/detail?id={$grievance->id}", $grievance, !empty($data['reopen_requested']) ? 'high' : 'normal');
            }
            return $feedback;
        });

        return response()->json($feedback, 201);
    }
}
