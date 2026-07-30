<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Volunteer::with(['user', 'village']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ilike', "%$search%")
                  ->orWhere('last_name', 'ilike', "%$search%")
                  ->orWhere('mobile_number', 'ilike', "%$search%")
                  ->orWhere('volunteer_id', 'ilike', "%$search%");
            });
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $results = $query->orderByDesc('performance_score')->paginate($perPage);

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
        $volunteer = Volunteer::with([
            'user', 'village', 'ward',
            'attendance', 'activities', 'training', 'performance',
            'surveyResponses.survey',
        ])->findOrFail($id);

        return response()->json($volunteer);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'         => Volunteer::count(),
            'active'        => Volunteer::where('status', 'active')->count(),
            'inactive'      => Volunteer::where('status', 'inactive')->count(),
            'available_now' => Volunteer::where('is_available', true)->where('status', 'active')->count(),
            'villages_covered' => Volunteer::where('status', 'active')->distinct('village_id')->count('village_id'),
        ]);
    }
}
