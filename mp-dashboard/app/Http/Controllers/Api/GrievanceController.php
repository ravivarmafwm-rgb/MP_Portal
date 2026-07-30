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

        $perPage = min((int) $request->get('per_page', 20), 100);
        $results = $query->orderBy('created_at', 'desc')->paginate($perPage);

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

    public function show(string $id): JsonResponse
    {
        $grievance = Grievance::with([
            'category', 'citizen', 'village', 'ward',
            'assignedTo', 'assignedDepartment',
            'assignments.assignedTo',
            'escalations',
            'updates',
            'feedback',
        ])->findOrFail($id);
        $this->authorize('view', $grievance);

        return response()->json($grievance);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Grievance::class);
        $data = $request->validate([
            'category_id'    => 'required|uuid|exists:grievance_categories,id',
            'citizen_id'     => 'nullable|uuid|exists:citizens,id',
            'citizen_name'   => 'required|string|max:150',
            'citizen_mobile' => 'required|string|max:15',
            'subject'        => 'required|string|max:255',
            'description'    => 'required|string',
            'priority'       => 'in:low,medium,high,urgent',
            'village_id'     => 'nullable|uuid|exists:villages,id',
            'source'         => 'nullable|string|max:50',
        ]);

        abort_unless(app(GeographicScopeService::class)->allowsVillage($request->user(), $data['village_id'] ?? null, $data['ward_id'] ?? null), 403, 'The selected location is outside your assigned area.');
        $grievance = Grievance::create([
            'grievance_number' => 'GRV' . str_pad(Grievance::count() + 1, 8, '0', STR_PAD_LEFT),
            'category_id'      => $data['category_id'],
            'citizen_id'       => $data['citizen_id'] ?? null,
            'citizen_name'     => $data['citizen_name'],
            'citizen_mobile'   => $data['citizen_mobile'],
            'subject'          => $data['subject'],
            'description'      => $data['description'],
            'priority'         => $data['priority'] ?? 'medium',
            'severity'         => $data['priority'] ?? 'medium',
            'status'           => 'pending',
            'source'           => $data['source'] ?? 'portal',
            'village_id'       => $data['village_id'] ?? null,
            'created_by'       => $request->user()->id,
        ]);

        ActivityLog::create([
            'user_id'     => $request->user()->id,
            'action'      => 'grievance_filed',
            'description' => "Grievance {$grievance->grievance_number} filed: {$grievance->subject}",
            'module'      => 'grievances',
        ]);

        NotificationService::notifyRoles(
            ['mp', 'mla', 'mp-staff', 'government-officer'],
            'New Grievance Filed',
            "Grievance {$grievance->grievance_number}: {$grievance->subject}",
            'grievance',
            '/grievances/list',
            $grievance,
            $grievance->priority === 'urgent' ? 'high' : 'normal',
        );

        return response()->json($grievance->fresh(['category']), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $grievance = Grievance::findOrFail($id);
        $this->authorize('update', $grievance);

        $data = $request->validate([
            'status'             => 'sometimes|in:pending,assigned,in_progress,escalated,resolved,closed',
            'assigned_to'        => 'nullable|uuid|exists:users,id',
            'assigned_department_id' => 'nullable|uuid|exists:departments,id',
            'resolution_summary' => 'nullable|string',
            'priority'           => 'sometimes|in:low,medium,high,urgent',
        ]);

        if (isset($data['status']) && $data['status'] === 'resolved' && empty($grievance->resolved_date)) {
            $data['resolved_date'] = now()->toDateString();
        }

        $grievance->update(array_merge($data, ['updated_by' => $request->user()->id]));

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
        ]);
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
}
