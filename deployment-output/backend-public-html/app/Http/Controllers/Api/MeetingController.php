<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\JanataDarbarSession;
use App\Models\MeetingNote;
use App\Models\MpTour;
use App\Models\PublicMeeting;
use App\Models\Citizen;
use App\Models\Mandal;
use App\Models\Village;
use App\Services\GeographicScopeService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

class MeetingController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    //  DASHBOARD STATS
    // ─────────────────────────────────────────────────────────────────────────
    public function dashboardStats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Appointment::class);
        $appointments = fn () => $this->scope(Appointment::query(), $request);
        $publicMeetingQuery = fn () => $this->scope(PublicMeeting::query(), $request);
        $tourQuery = fn () => $this->scope(MpTour::query(), $request);
        $darbarQuery = fn () => $this->scope(JanataDarbarSession::query(), $request);
        $today = now()->toDateString();

        $totalAppointments = $appointments()->count();
        $pending           = $appointments()->where('status', 'pending')->count();
        $confirmed         = $appointments()->where('status', 'confirmed')->count();
        $completed         = $appointments()->where('status', 'completed')->count();
        $publicMeetings    = $publicMeetingQuery()->where('status', 'scheduled')->count();
        $tours             = $tourQuery()->where('status', 'planned')->count();
        $citizensMet       = $appointments()->where('status', 'completed')->count()
            + $tourQuery()->sum('citizens_met');
        $villagesVisited   = $tourQuery()->where('status', 'completed')->sum('villages_count');

        // Engagement score (composite)
        $totalPossible = max(1, $totalAppointments);
        $resolutionRate = $totalAppointments > 0
            ? round(($completed / $totalAppointments) * 100) : 0;
        $engagementScore = min(99, round(
            ($resolutionRate * 0.4) +
            (min(50, $villagesVisited) * 1.0) +
            30
        ));

        // Today's schedule
        $todayAppointments = $appointments()->whereDate('scheduled_date', $today)
            ->whereIn('status', ['confirmed', 'pending'])
            ->orderBy('scheduled_time')
            ->limit(10)
            ->get()
            ->map(fn($a) => [
                'id'    => $a->id,
                'type'  => 'appointment',
                'title' => $a->citizen_name . ' — ' . $a->purpose,
                'time'  => $a->scheduled_time ? Carbon::parse($a->scheduled_time)->format('g:i A') : 'TBD',
                'badge' => ucfirst($a->priority),
                'tone'  => match($a->priority) {
                    'urgent' => 'destructive',
                    'high'   => 'warning',
                    default  => 'primary',
                },
            ]);

        $todayMeetings = $publicMeetingQuery()->whereDate('meeting_date', $today)
            ->limit(5)
            ->get()
            ->map(fn($m) => [
                'id'    => $m->id,
                'type'  => 'public_meeting',
                'title' => $m->title,
                'time'  => Carbon::parse($m->start_time)->format('g:i A'),
                'badge' => ucfirst($m->meeting_type),
                'tone'  => 'info',
            ]);

        $todaySchedule = $todayAppointments->merge($todayMeetings)->sortBy('time')->values();

        // Weekly trend (last 7 days appointments)
        $weeklyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $d = now()->subDays($i);
            $weeklyTrend[] = [
                'd'         => $d->format('D'),
                'requested' => $appointments()->whereDate('requested_date', $d)->count(),
                'completed' => $appointments()->whereDate('scheduled_date', $d)->where('status', 'completed')->count(),
            ];
        }

        // Appointment category distribution
        $byCategory = $appointments()->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->map(fn($r) => ['name' => ucfirst($r->category), 'value' => (int)$r->count]);

        // Village engagement  
        $byVillage = $appointments()->selectRaw('citizen_village, COUNT(*) as count')
            ->whereNotNull('citizen_village')
            ->groupBy('citizen_village')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->map(fn($r) => ['name' => $r->citizen_village, 'value' => (int)$r->count]);

        // Upcoming events (next 14 days)
        $upcomingAppointments = $appointments()->where('scheduled_date', '>=', $today)
            ->where('scheduled_date', '<=', now()->addDays(14)->toDateString())
            ->whereIn('status', ['confirmed', 'pending'])
            ->orderBy('scheduled_date')
            ->orderBy('scheduled_time')
            ->limit(5)
            ->get()
            ->map(fn($a) => [
                'id'    => $a->id,
                'type'  => 'appointment',
                'date'  => Carbon::parse($a->scheduled_date)->format('D'),
                'day'   => Carbon::parse($a->scheduled_date)->format('j'),
                'month' => Carbon::parse($a->scheduled_date)->format('M'),
                'title' => $a->citizen_name . ' — ' . $a->purpose,
                'meta'  => Carbon::parse($a->scheduled_time ?? '10:00')->format('g:i A') . ' · ' . ($a->venue ?? 'MP Office'),
                'tone'  => 'bg-primary/10 text-primary',
            ]);

        $upcomingPublicMeetings = $publicMeetingQuery()->where('meeting_date', '>=', $today)
            ->where('status', 'scheduled')
            ->orderBy('meeting_date')
            ->limit(5)
            ->get()
            ->map(fn($m) => [
                'id'    => $m->id,
                'type'  => 'public_meeting',
                'date'  => Carbon::parse($m->meeting_date)->format('D'),
                'day'   => Carbon::parse($m->meeting_date)->format('j'),
                'month' => Carbon::parse($m->meeting_date)->format('M'),
                'title' => $m->title,
                'meta'  => Carbon::parse($m->start_time)->format('g:i A') . ' · ' . $m->venue,
                'tone'  => 'bg-info/10 text-info',
            ]);

        $upcomingTours = $tourQuery()->where('start_date', '>=', $today)
            ->where('status', 'planned')
            ->orderBy('start_date')
            ->limit(3)
            ->get()
            ->map(fn($t) => [
                'id'    => $t->id,
                'type'  => 'tour',
                'date'  => Carbon::parse($t->start_date)->format('D'),
                'day'   => Carbon::parse($t->start_date)->format('j'),
                'month' => Carbon::parse($t->start_date)->format('M'),
                'title' => $t->title,
                'meta'  => Carbon::parse($t->start_date)->format('d M Y') . ' · ' . $t->villages_count . ' villages',
                'tone'  => 'bg-success/10 text-success',
            ]);

        $upcoming = collect($upcomingAppointments)
            ->merge($upcomingPublicMeetings)
            ->merge($upcomingTours)
            ->sortBy('day')
            ->values();

        // Recent Janata Darbar sessions
        $recentJD = $darbarQuery()->orderByDesc('session_date')->limit(4)->get();

        return response()->json([
            'kpis' => [
                'total_appointments' => $totalAppointments,
                'pending'            => $pending,
                'confirmed'          => $confirmed,
                'completed'          => $completed,
                'public_meetings'    => $publicMeetings,
                'tours_planned'      => $tours,
                'citizens_met'       => $citizensMet,
                'villages_visited'   => $villagesVisited,
            ],
            'engagement_score'  => $engagementScore,
            'today_schedule'    => $todaySchedule,
            'weekly_trend'      => $weeklyTrend,
            'by_category'       => $byCategory,
            'by_village'        => $byVillage,
            'upcoming'          => $upcoming,
            'recent_jd_sessions'=> $recentJD,
            'date_label'        => now()->format('l, j F Y'),
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  APPOINTMENTS
    // ─────────────────────────────────────────────────────────────────────────
    public function appointments(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Appointment::class);
        $query = Appointment::with(['citizen', 'village', 'mandal']);
        $this->scope($query, $request);

        if ($s = $request->get('search')) {
            $query->where(function ($q) use ($s) {
                $q->where('citizen_name', 'ilike', "%$s%")
                  ->orWhere('citizen_mobile', 'ilike', "%$s%")
                  ->orWhere('appointment_number', 'ilike', "%$s%")
                  ->orWhere('purpose', 'ilike', "%$s%");
            });
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }
        if ($priority = $request->get('priority')) {
            $query->where('priority', $priority);
        }
        if ($date = $request->get('date')) {
            $query->whereDate('scheduled_date', $date);
        }
        if ($request->get('today')) {
            $query->whereDate('scheduled_date', now()->toDateString());
        }

        $perPage = min((int)$request->get('per_page', 20), 100);
        $results = $query->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END")
            ->orderBy('requested_date', 'desc')
            ->paginate($perPage);

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

    public function appointmentStats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Appointment::class);
        $appointments = fn () => $this->scope(Appointment::query(), $request);
        return response()->json([
            'total'       => $appointments()->count(),
            'pending'     => $appointments()->where('status', 'pending')->count(),
            'confirmed'   => $appointments()->where('status', 'confirmed')->count(),
            'completed'   => $appointments()->where('status', 'completed')->count(),
            'cancelled'   => $appointments()->where('status', 'cancelled')->count(),
            'today'       => $appointments()->whereDate('scheduled_date', now())->count(),
            'this_week'   => $appointments()->whereBetween('scheduled_date', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'follow_up_pending' => $appointments()->where('follow_up_required', true)->where('follow_up_completed', false)->count(),
            'avg_satisfaction' => round($appointments()->whereNotNull('satisfaction_rating')->avg('satisfaction_rating') ?? 0, 1),
        ]);
    }

    public function showAppointment(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::with([
            'citizen.addresses.village',
            'citizen.grievances.category',
            'citizen.schemeApplications.scheme',
            'grievance',
            'schemeApplication.scheme',
            'village',
            'mandal',
            'assignedOfficer',
            'notes',
        ])->findOrFail($id);
        $this->authorize('view', $appointment);

        return response()->json($appointment);
    }

    public function storeAppointment(Request $request): JsonResponse
    {
        $this->authorize('create', Appointment::class);
        $data = $request->validate([
            'citizen_name'     => 'required|string|max:200',
            'citizen_mobile'   => 'nullable|string|max:15',
            'citizen_village'  => 'nullable|string|max:200',
            'citizen_mandal'   => 'nullable|string|max:200',
            'citizen_id'       => 'nullable|uuid|exists:citizens,id',
            'village_id'       => 'nullable|uuid|exists:villages,id',
            'mandal_id'        => 'nullable|uuid|exists:mandals,id',
            'purpose'          => 'required|string|max:500',
            'description'      => 'nullable|string',
            'meeting_type'     => 'in:in_person,phone,video',
            'category'         => 'in:general,grievance,scheme,project,personal',
            'priority'         => 'in:low,medium,high,urgent',
            'requested_date'   => 'required|date',
            'requested_time'   => 'nullable|date_format:H:i',
        ]);
        if (!empty($data['citizen_id'])) {
            abort_unless(app(GeographicScopeService::class)->allows($request->user(), Citizen::findOrFail($data['citizen_id'])), 403);
        }
        $data = $this->normalizeScope($data, $request, Appointment::class);

        $count = Appointment::count() + 1;
        $appointment = Appointment::create(array_merge($data, [
            'appointment_number' => 'APT' . str_pad($count, 5, '0', STR_PAD_LEFT),
            'status'             => 'pending',
            'token_number'       => 'T' . str_pad($count, 3, '0', STR_PAD_LEFT),
            'created_by'         => $request->user()->id,
        ]));

        return response()->json($appointment, 201);
    }

    public function updateAppointment(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::findOrFail($id);
        $this->authorize('update', $appointment);
        $data = $request->validate([
            'status'           => 'sometimes|in:pending,confirmed,rescheduled,completed,cancelled,no_show',
            'scheduled_date'   => 'nullable|date',
            'scheduled_time'   => 'nullable',
            'meeting_outcome'  => 'nullable|string',
            'action_items'     => 'nullable|string',
            'follow_up_required' => 'nullable|boolean',
            'follow_up_date'   => 'nullable|date',
            'follow_up_notes'  => 'nullable|string',
            'follow_up_completed' => 'nullable|boolean',
            'satisfaction_rating' => 'nullable|integer|min:1|max:5',
            'citizen_feedback' => 'nullable|string',
        ]);
        $appointment->update(array_merge($data, ['updated_by' => $request->user()->id]));

        return response()->json($appointment->fresh());
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  PUBLIC MEETINGS
    // ─────────────────────────────────────────────────────────────────────────
    public function publicMeetings(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PublicMeeting::class);
        $query = PublicMeeting::with(['village', 'mandal', 'constituency']);
        $this->scope($query, $request);

        if ($s = $request->get('search')) {
            $query->where('title', 'ilike', "%$s%");
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }
        if ($type = $request->get('type')) {
            $query->where('meeting_type', $type);
        }

        $perPage = min((int)$request->get('per_page', 20), 100);
        $results = $query->orderByDesc('meeting_date')->paginate($perPage);

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

    public function storePublicMeeting(Request $request): JsonResponse
    {
        $this->authorize('create', PublicMeeting::class);
        $data = $request->validate([
            'title'            => 'required|string|max:300',
            'description'      => 'nullable|string',
            'meeting_type'     => 'required|in:town_hall,community_meeting,department_review,stakeholder_meeting,awareness_program,public_hearing,other',
            'venue'            => 'required|string|max:300',
            'meeting_date'     => 'required|date',
            'start_time'       => 'required|date_format:H:i',
            'expected_attendance' => 'nullable|integer|min:0',
            'village_id'       => 'nullable|uuid|exists:villages,id',
            'mandal_id'        => 'nullable|uuid|exists:mandals,id',
            'agenda_items'     => 'nullable|array',
            'chief_guest'      => 'nullable|string|max:200',
        ]);
        $data = $this->normalizeScope($data, $request, PublicMeeting::class);

        $count = PublicMeeting::count() + 1;
        $meeting = PublicMeeting::create(array_merge($data, [
            'meeting_number' => 'PM' . str_pad($count, 4, '0', STR_PAD_LEFT),
            'status'         => 'scheduled',
            'created_by'     => $request->user()->id,
        ]));

        return response()->json($meeting, 201);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  MP TOURS
    // ─────────────────────────────────────────────────────────────────────────
    public function tours(Request $request): JsonResponse
    {
        $this->authorize('viewAny', MpTour::class);
        $query = MpTour::with('constituency');
        $this->scope($query, $request);

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $perPage = min((int)$request->get('per_page', 20), 100);
        $results = $query->orderByDesc('start_date')->paginate($perPage);

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

    public function storeTour(Request $request): JsonResponse
    {
        $this->authorize('create', MpTour::class);
        $data = $request->validate([
            'title'       => 'required|string|max:300',
            'objectives'  => 'nullable|string',
            'tour_type'   => 'required|in:constituency_visit,inspection,project_inspection,field_survey,other',
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'villages_count' => 'nullable|integer|min:0',
        ]);
        $data = $this->normalizeScope($data, $request, MpTour::class);

        $count = MpTour::count() + 1;
        $tour = MpTour::create(array_merge($data, [
            'tour_number' => 'TOUR' . str_pad($count, 4, '0', STR_PAD_LEFT),
            'status'      => 'planned',
            'created_by'  => $request->user()->id,
        ]));

        return response()->json($tour, 201);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  JANATA DARBAR
    // ─────────────────────────────────────────────────────────────────────────
    public function janataDarbars(Request $request): JsonResponse
    {
        $this->authorize('viewAny', JanataDarbarSession::class);
        $query = JanataDarbarSession::with(['constituency', 'mandal', 'village']);
        $this->scope($query, $request);

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $perPage = min((int)$request->get('per_page', 20), 100);
        $results = $query->orderByDesc('session_date')->paginate($perPage);

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

    public function storeJanataDarbar(Request $request): JsonResponse
    {
        $this->authorize('create', JanataDarbarSession::class);
        $data = $request->validate([
            'title'            => 'required|string|max:300',
            'venue'            => 'required|string|max:300',
            'session_date'     => 'required|date',
            'start_time'       => 'nullable|date_format:H:i',
            'mandal_id'        => 'nullable|uuid|exists:mandals,id',
            'village_id'       => 'nullable|uuid|exists:villages,id',
            'max_registrations'=> 'nullable|integer|min:10',
        ]);
        $data = $this->normalizeScope($data, $request, JanataDarbarSession::class);

        $count = JanataDarbarSession::count() + 1;
        $session = JanataDarbarSession::create(array_merge($data, [
            'session_number' => 'JD' . str_pad($count, 4, '0', STR_PAD_LEFT),
            'status'         => 'scheduled',
            'created_by'     => $request->user()->id,
        ]));

        return response()->json($session, 201);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  CALENDAR — all events in a date range
    // ─────────────────────────────────────────────────────────────────────────
    public function calendar(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Appointment::class);
        $start = $request->get('start', now()->startOfMonth()->toDateString());
        $end   = $request->get('end',   now()->endOfMonth()->toDateString());

        $appointments = $this->scope(Appointment::query(), $request)
            ->whereBetween('scheduled_date', [$start, $end])
            ->get()
            ->map(fn($a) => [
                'id'      => $a->id,
                'type'    => 'appointment',
                'title'   => $a->citizen_name . ' — ' . $a->purpose,
                'date'    => $a->scheduled_date?->toDateString(),
                'time'    => $a->scheduled_time,
                'status'  => $a->status,
                'priority'=> $a->priority,
                'color'   => match($a->priority) { 'urgent' => '#ef4444', 'high' => '#f59e0b', default => '#3b82f6' },
            ]);

        $publicMeetings = $this->scope(PublicMeeting::query(), $request)
            ->whereBetween('meeting_date', [$start, $end])
            ->get()
            ->map(fn($m) => [
                'id'    => $m->id,
                'type'  => 'public_meeting',
                'title' => $m->title,
                'date'  => $m->meeting_date->toDateString(),
                'time'  => $m->start_time,
                'status'=> $m->status,
                'color' => '#6366f1',
            ]);

        $tours = $this->scope(MpTour::query(), $request)
            ->whereBetween('start_date', [$start, $end])
            ->get()
            ->map(fn($t) => [
                'id'    => $t->id,
                'type'  => 'tour',
                'title' => $t->title,
                'date'  => $t->start_date->toDateString(),
                'end_date' => $t->end_date?->toDateString(),
                'status'=> $t->status,
                'color' => '#10b981',
            ]);

        $jdSessions = $this->scope(JanataDarbarSession::query(), $request)
            ->whereBetween('session_date', [$start, $end])
            ->get()
            ->map(fn($s) => [
                'id'    => $s->id,
                'type'  => 'janata_darbar',
                'title' => $s->title,
                'date'  => $s->session_date->toDateString(),
                'time'  => $s->start_time,
                'status'=> $s->status,
                'color' => '#f59e0b',
            ]);

        return response()->json([
            'events' => collect($appointments)
                ->merge($publicMeetings)
                ->merge($tours)
                ->merge($jdSessions)
                ->sortBy('date')
                ->values(),
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  ENGAGEMENT ANALYTICS
    // ─────────────────────────────────────────────────────────────────────────
    public function engagementAnalytics(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Appointment::class);
        $appointments = fn() => $this->scope(Appointment::query(), $request);
        $publicMeetings = fn() => $this->scope(PublicMeeting::query(), $request);

        // Monthly appointment trend (last 6 months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthlyTrend[] = [
                'month'     => $month->format('M Y'),
                'appointments' => $appointments()->whereYear('requested_date', $month->year)
                    ->whereMonth('requested_date', $month->month)->count(),
                'completed' => $appointments()->where('status', 'completed')
                    ->whereYear('scheduled_date', $month->year)
                    ->whereMonth('scheduled_date', $month->month)->count(),
                'public_meetings' => $publicMeetings()->whereYear('meeting_date', $month->year)
                    ->whereMonth('meeting_date', $month->month)->count(),
            ];
        }

        // Appointment by purpose category
        $byCategory = $appointments()->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('count')
            ->get()
            ->map(fn($r) => ['name' => ucfirst($r->category), 'value' => (int)$r->count]);

        // By village
        $byVillage = $appointments()->selectRaw('citizen_village as village, COUNT(*) as count')
            ->whereNotNull('citizen_village')
            ->groupBy('citizen_village')
            ->orderByDesc('count')
            ->limit(8)
            ->get()
            ->map(fn($r) => ['village' => $r->village, 'count' => (int)$r->count]);

        // By mandal
        $byMandal = $appointments()->selectRaw('citizen_mandal as mandal, COUNT(*) as count')
            ->whereNotNull('citizen_mandal')
            ->groupBy('citizen_mandal')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->map(fn($r) => ['mandal' => $r->mandal, 'count' => (int)$r->count]);

        // Public meeting attendance trend
        $meetingAttendance = $publicMeetings()->where('status', 'completed')
            ->orderByDesc('meeting_date')
            ->limit(8)
            ->get()
            ->map(fn($m) => [
                'title'    => substr($m->title, 0, 20) . '...',
                'expected' => $m->expected_attendance,
                'actual'   => $m->actual_attendance ?? 0,
                'date'     => $m->meeting_date->format('d M'),
            ]);

        // Satisfaction ratings distribution
        $ratings = [];
        for ($r = 1; $r <= 5; $r++) {
            $ratings[] = [
                'rating' => $r . '★',
                'count'  => $appointments()->where('satisfaction_rating', $r)->count(),
            ];
        }

        return response()->json([
            'monthly_trend'      => $monthlyTrend,
            'by_category'        => $byCategory,
            'by_village'         => $byVillage,
            'by_mandal'          => $byMandal,
            'meeting_attendance' => $meetingAttendance,
            'satisfaction'       => $ratings,
            'avg_satisfaction'   => round($appointments()->whereNotNull('satisfaction_rating')->avg('satisfaction_rating') ?? 0, 1),
            'follow_up_pending'  => $appointments()->where('follow_up_required', true)->where('follow_up_completed', false)->count(),
        ]);
    }

    private function scope(Builder $query, Request $request): Builder
    {
        return app(GeographicScopeService::class)->applyHierarchicalResources($query, $request->user());
    }

    private function normalizeScope(array $data, Request $request, string $modelClass): array
    {
        $hierarchy = [];
        if (!empty($data['village_id'])) {
            $village = Village::with('mandal.assemblyConstituency')->findOrFail($data['village_id']);
            if (!empty($data['mandal_id']) && $data['mandal_id'] !== $village->mandal_id) {
                throw ValidationException::withMessages(['mandal_id' => ['The mandal does not contain the selected village.']]);
            }
            $hierarchy = [
                'village_id' => $village->id,
                'mandal_id' => $village->mandal_id,
                'assembly_constituency_id' => $village->mandal?->assembly_constituency_id,
                'constituency_id' => $village->mandal?->assemblyConstituency?->constituency_id,
            ];
        } elseif (!empty($data['mandal_id'])) {
            $mandal = Mandal::with('assemblyConstituency')->findOrFail($data['mandal_id']);
            $hierarchy = [
                'mandal_id' => $mandal->id,
                'assembly_constituency_id' => $mandal->assembly_constituency_id,
                'constituency_id' => $mandal->assemblyConstituency?->constituency_id,
            ];
        } else {
            foreach (['constituency_id', 'assembly_constituency_id', 'mandal_id', 'village_id'] as $field) {
                if ($request->user()->{$field}) $hierarchy[$field] = $request->user()->{$field};
            }
        }

        $model = new $modelClass();
        foreach ($hierarchy as $field => $value) {
            if ($model->isFillable($field)) $data[$field] = $value;
        }
        $model->fill($data);
        abort_unless(app(GeographicScopeService::class)->allowsHierarchicalResource($request->user(), $model), 403, 'The selected location is outside your assigned area.');

        return $data;
    }
}
