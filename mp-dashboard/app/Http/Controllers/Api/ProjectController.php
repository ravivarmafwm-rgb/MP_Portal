<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::with(['constituency', 'village', 'contractor']);

        if ($search = $request->get('search')) {
            $query->where('name', 'ilike', "%$search%");
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }
        if ($type = $request->get('project_type')) {
            $query->where('project_type', $type);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $results = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $results->items(),
            'meta' => [
                'total' => $results->total(),
                'per_page' => $results->perPage(),
                'current_page' => $results->currentPage(),
                'last_page' => $results->lastPage(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $project = Project::with([
            'constituency', 'village', 'mandal', 'contractor',
            'milestones', 'updates', 'budgets', 'photos',
        ])->findOrFail($id);

        return response()->json($project);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'       => Project::count(),
            'in_progress' => Project::where('status', 'in_progress')->count(),
            'completed'   => Project::where('status', 'completed')->count(),
            'delayed'     => Project::where('status', 'delayed')->count(),
            'proposed'    => Project::where('status', 'proposed')->count(),
            'total_budget'=> (float) Project::sum('sanctioned_amount'),
            'total_spent' => (float) Project::sum('expenditure'),
        ]);
    }
}
