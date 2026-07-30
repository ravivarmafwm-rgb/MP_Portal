<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Volunteer;
use App\Models\VolunteerActivity;
use App\Models\VolunteerAttendance;
use App\Models\VolunteerPerformance;
use App\Models\VolunteerTraining;
use App\Models\Citizen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Services\GeographicScopeService;
use Illuminate\Support\Facades\DB;

class VolunteerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Volunteer::class);
        $query = Volunteer::with(['user', 'village']);
        app(GeographicScopeService::class)->apply($query, $request->user());

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
        $this->authorize('view', $volunteer);

        return response()->json($volunteer);
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Volunteer::class);
        $base = Volunteer::query();
        app(GeographicScopeService::class)->apply($base, $request->user());
        return response()->json([
            'total' => (clone $base)->count(), 'active' => (clone $base)->where('status', 'active')->count(),
            'inactive' => (clone $base)->where('status', 'inactive')->count(),
            'available_now' => (clone $base)->where('is_available', true)->where('status', 'active')->count(),
            'villages_covered' => (clone $base)->where('status', 'active')->distinct('village_id')->count('village_id'),
        ]);
    }

    public function activities(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Volunteer::class);
        $query = VolunteerActivity::with(['volunteer:id,volunteer_id,first_name,last_name,village_id', 'village:id,name']);
        $this->scopeRelated($query, $request);
        if ($type = $request->get('type')) $query->where('activity_type', $type);
        if ($search = trim((string) $request->get('search'))) $query->where(fn ($q) => $q->where('title', 'ilike', "%{$search}%")->orWhere('description', 'ilike', "%{$search}%"));
        $results = $query->latest('activity_date')->paginate($this->perPage($request));
        return response()->json(['data' => $results->items(), 'meta' => $this->meta($results)]);
    }

    public function attendance(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Volunteer::class);
        $query = VolunteerAttendance::with('volunteer:id,volunteer_id,first_name,last_name,village_id');
        $this->scopeRelated($query, $request);
        if ($status = $request->get('status')) $query->where('status', $status);
        if ($date = $request->get('date')) $query->whereDate('attendance_date', $date);
        $results = $query->latest('attendance_date')->paginate($this->perPage($request));
        return response()->json(['data' => $results->items(), 'meta' => $this->meta($results)]);
    }

    public function performance(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Volunteer::class);
        $query = VolunteerPerformance::with('volunteer:id,volunteer_id,first_name,last_name,village_id');
        $this->scopeRelated($query, $request);
        $results = $query->orderByDesc('overall_score')->paginate($this->perPage($request));
        return response()->json(['data' => $results->items(), 'meta' => $this->meta($results)]);
    }

    public function training(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Volunteer::class);
        $query = VolunteerTraining::with('volunteer:id,volunteer_id,first_name,last_name,village_id');
        $this->scopeRelated($query, $request);
        if ($status = $request->get('status')) $query->where('status', $status);
        if ($search = trim((string) $request->get('search'))) {
            $query->where(fn ($q) => $q->where('training_name', 'ilike', "%{$search}%")->orWhere('training_type', 'ilike', "%{$search}%"));
        }
        $results = $query->latest('start_date')->paginate($this->perPage($request));
        return response()->json(['data' => $results->items(), 'meta' => $this->meta($results)]);
    }

    public function geographicCoverage(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Volunteer::class);
        $query = Volunteer::query()
            ->join('villages', 'villages.id', '=', 'volunteers.village_id')
            ->leftJoin('mandals', 'mandals.id', '=', 'villages.mandal_id');
        app(GeographicScopeService::class)->apply($query, $request->user());
        $rows = $query->where('volunteers.status', 'active')
            ->select('villages.id', 'villages.name', 'mandals.name as mandal_name', DB::raw('COUNT(volunteers.id) AS volunteer_count'))
            ->groupBy('villages.id', 'villages.name', 'mandals.name')
            ->orderByDesc('volunteer_count')->get();
        return response()->json(['data' => $rows, 'total_active_volunteers' => $rows->sum('volunteer_count'), 'villages_with_active_volunteers' => $rows->count()]);
    }

    public function enrolledCitizens(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Volunteer::class);
        $volunteers = Volunteer::query();
        app(GeographicScopeService::class)->apply($volunteers, $request->user());
        $userIds = $volunteers->whereNotNull('user_id')->pluck('user_id');
        $query = Citizen::with(['createdBy.volunteer:id,user_id,volunteer_id,first_name,last_name', 'addresses.village:id,name'])
            ->whereIn('created_by', $userIds);
        if ($search = trim((string) $request->get('search'))) $query->where(fn ($q) => $q->where('first_name', 'ilike', "%{$search}%")->orWhere('last_name', 'ilike', "%{$search}%")->orWhere('unique_id', 'ilike', "%{$search}%"));
        $results = $query->latest()->paginate($this->perPage($request));
        $top = Citizen::query()->whereIn('created_by', $userIds)->select('created_by', DB::raw('COUNT(*) AS total'))->groupBy('created_by')->orderByDesc('total')->with('createdBy:id,name')->first();
        return response()->json(['data' => $results->items(), 'meta' => $this->meta($results), 'stats' => [
            'total' => Citizen::whereIn('created_by', $userIds)->count(),
            'this_week' => Citizen::whereIn('created_by', $userIds)->where('created_at', '>=', now()->startOfWeek())->count(),
            'top_volunteer' => $top?->createdBy?->name,
        ]]);
    }

    private function scopeRelated($query, Request $request): void
    {
        $volunteers = Volunteer::query();
        app(GeographicScopeService::class)->apply($volunteers, $request->user());
        $query->whereIn('volunteer_id', $volunteers->select('id'));
    }

    private function perPage(Request $request): int { return min(max((int) $request->get('per_page', 20), 1), 100); }
    private function meta($results): array { return ['total' => $results->total(), 'per_page' => $results->perPage(), 'current_page' => $results->currentPage(), 'last_page' => $results->lastPage()]; }
}
