<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grievance;
use App\Models\GrievanceCategory;
use App\Models\ActivityLog;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GrievanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Grievance::with(['category', 'citizen', 'village', 'assignedDepartment']);

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

        return response()->json($grievance);
    }

    public function store(Request $request): JsonResponse
    {
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

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'    => Grievance::count(),
            'pending'  => Grievance::where('status', 'pending')->count(),
            'assigned' => Grievance::where('status', 'assigned')->count(),
            'in_progress' => Grievance::where('status', 'in_progress')->count(),
            'escalated'=> Grievance::where('status', 'escalated')->count(),
            'resolved' => Grievance::where('status', 'resolved')->count(),
            'closed'   => Grievance::where('status', 'closed')->count(),
            'this_week'=> Grievance::where('created_at', '>=', now()->startOfWeek())->count(),
        ]);
    }

    public function categories(): JsonResponse
    {
        $cats = GrievanceCategory::withCount('grievances')
            ->where('is_active', true)
            ->orderByDesc('grievances_count')
            ->get();

        return response()->json($cats);
    }
}
