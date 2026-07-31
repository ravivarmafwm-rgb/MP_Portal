<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Grievance;
use App\Models\Project;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;

class PublicPortalController extends Controller
{
    public function statistics(): JsonResponse
    {
        return response()->json([
            'citizens_served' => Citizen::count(),
            'grievances_resolved' => Grievance::whereIn('status', ['resolved', 'closed'])->count(),
            'projects_completed' => Project::where('status', 'completed')->count(),
            'active_volunteers' => Volunteer::where('status', 'active')->count(),
            'updated_at' => now()->toIso8601String(),
        ])->header('Cache-Control', 'public, max-age=300');
    }
}
