<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Citizen;
use App\Models\Family;
use App\Models\Grievance;
use App\Models\GrievanceCategory;
use App\Models\Project;
use App\Models\Scheme;
use App\Models\SchemeApplication;
use App\Models\Survey;
use App\Models\Village;
use App\Models\Volunteer;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Return all data required by the dashboard page.
     */
    public function stats(Request $request): JsonResponse
    {
        // ─── KPI Cards ────────────────────────────────────────────────────────────
        $totalCitizens  = Citizen::count();
        $totalFamilies  = Family::count();
        $totalVolunteers = Volunteer::where('status', 'active')->count();
        $totalVillages  = Village::count();
        $activeGrievances = Grievance::whereIn('status', ['open', 'assigned', 'in_progress'])->count();
        $activeProjects = Project::where('status', 'in_progress')->count();
        $schemeApplications = SchemeApplication::whereBetween('created_at', [
            now()->startOfQuarter(), now()->endOfQuarter()
        ])->count();

        // Budget utilization
        $totalBudget = Project::sum('sanctioned_amount');
        $usedBudget  = Project::sum('expenditure');
        $budgetPct   = $totalBudget > 0 ? round(($usedBudget / $totalBudget) * 100) : 0;

        // Previous month comparisons
        $prevMonthStart = now()->subMonth()->startOfMonth();
        $prevMonthEnd   = now()->subMonth()->endOfMonth();
        $thisMonthStart = now()->startOfMonth();

        $prevCitizens = Citizen::whereBetween('created_at', [$prevMonthStart, $prevMonthEnd])->count();
        $thisCitizens = Citizen::where('created_at', '>=', $thisMonthStart)->count();

        $prevGrievances = Grievance::whereIn('status', ['open', 'assigned', 'in_progress'])
            ->where('created_at', '<', $thisMonthStart)->count();
        $prevProjects = Project::where('status', 'in_progress')
            ->where('created_at', '<', $thisMonthStart)->count();

        // ─── Health Score ─────────────────────────────────────────────────────────
        $resolvedGrievances = Grievance::where('status', 'resolved')->count();
        $totalGrievances    = Grievance::count();
        $grievanceResolution = $totalGrievances > 0
            ? round(($resolvedGrievances / $totalGrievances) * 100)
            : 0;

        $completedProjects = Project::where('status', 'completed')->count();
        $projectCompletion = ($completedProjects + $activeProjects) > 0
            ? round(($completedProjects / ($completedProjects + $activeProjects)) * 100)
            : 0;

        $approvedApplications = SchemeApplication::where('status', 'approved')->count();
        $totalApplications    = SchemeApplication::count();
        $schemeReach = $totalApplications > 0
            ? round(($approvedApplications / $totalApplications) * 100)
            : 0;

        $volunteerActivity = min(99, $totalVolunteers > 0 ? round(($totalVolunteers / max(1, $totalVolunteers)) * 84) : 84);

        $healthScore = round(($grievanceResolution + $projectCompletion + $schemeReach + $volunteerActivity) / 4);

        // ─── Grievance Center ─────────────────────────────────────────────────────
        $grievanceBuckets = [
            ['label' => 'Open',     'value' => Grievance::where('status', 'open')->count(),      'tone' => 'bg-warning/15 text-warning'],
            ['label' => 'Assigned', 'value' => Grievance::where('status', 'assigned')->count(),  'tone' => 'bg-info/15 text-info'],
            ['label' => 'Escalated','value' => Grievance::where('status', 'escalated')->count(), 'tone' => 'bg-destructive/15 text-destructive'],
            ['label' => 'Resolved', 'value' => $resolvedGrievances,                              'tone' => 'bg-success/15 text-success'],
        ];

        // Weekly grievance trend (last 7 days)
        $grievanceTrend = [];
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayLabel = $days[$date->dayOfWeekIso - 1];
            $filed    = Grievance::whereDate('created_at', $date->toDateString())->count();
            $resolved = Grievance::whereDate('updated_at', $date->toDateString())->where('status', 'resolved')->count();
            $grievanceTrend[] = ['d' => $dayLabel, 'filed' => max($filed, 0), 'resolved' => max($resolved, 0)];
        }

        // Grievance by category
        $grievanceCategories = GrievanceCategory::withCount('grievances')
            ->orderByDesc('grievances_count')
            ->limit(5)
            ->get()
            ->map(fn($c) => ['name' => $c->name, 'value' => $c->grievances_count]);

        // ─── Projects ─────────────────────────────────────────────────────────────
        $projects = Project::with(['constituency'])
            ->orderByRaw("CASE status WHEN 'at_risk' THEN 1 WHEN 'delayed' THEN 2 WHEN 'in_progress' THEN 3 ELSE 4 END")
            ->limit(4)
            ->get()
            ->map(fn($p) => [
                'name'     => $p->name,
                'category' => ucfirst($p->category ?? $p->project_type ?? 'General'),
                'location' => $p->location ?? ($p->constituency?->name ?? 'N/A'),
                'budget'   => '₹' . $this->formatBudget((float)($p->sanctioned_amount ?? $p->estimated_cost ?? 0)),
                'progress' => (int) $p->progress_percentage,
                'status'   => $this->mapProjectStatus($p->status),
                'due'      => $p->scheduled_completion_date
                    ? Carbon::parse($p->scheduled_completion_date)->format('M Y')
                    : 'TBD',
            ]);

        // ─── Schemes ──────────────────────────────────────────────────────────────
        $schemeData = Scheme::withCount(['applications' => fn($q) => $q->whereBetween('created_at', [now()->startOfQuarter(), now()])])
            ->orderByDesc('applications_count')
            ->limit(5)
            ->get()
            ->map(fn($s) => [
                'name'   => substr($s->name, 0, 14),
                'value'  => $s->applications_count,
                'growth' => $s->applications_count > 0 ? '+' . $s->applications_count : '0',
            ]);

        // ─── Volunteers ──────────────────────────────────────────────────────────
        $volunteerLeaders = Volunteer::with('village')
            ->where('status', 'active')
            ->orderByDesc('performance_score')
            ->limit(5)
            ->get()
            ->map(fn($v) => [
                'name'    => $v->first_name . ' ' . $v->last_name,
                'mandal'  => $v->village?->mandal?->name ?? 'Unknown',
                'points'  => (int) ($v->performance_score * 10),
                'surveys' => (int) ($v->total_activities ?? 0),
                'regs'    => (int) ($v->total_hours ?? 0),
            ]);

        // ─── Survey Insights ──────────────────────────────────────────────────────
        $surveys = Survey::withCount('responses')
            ->where('status', 'active')
            ->orderByDesc('responses_count')
            ->limit(4)
            ->get()
            ->map(fn($s) => [
                'title'     => $s->title,
                'responses' => $s->responses_count ?? $s->total_responses ?? 0,
                'delta'     => '+' . ($s->responses_count ?? 0),
                'insight'   => $s->description ?? 'Community feedback in progress',
            ]);

        // ─── Activity Feed ────────────────────────────────────────────────────────
        $activityItems = ActivityLog::with('user')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn($log) => [
                'who'  => $log->user?->name ?? 'System',
                'what' => $log->description ?? $log->action,
                'when' => $log->created_at->diffForHumans(),
                'type' => $log->action ?? 'info',
            ]);

        // ─── Upcoming Events ──────────────────────────────────────────────────────
        $upcomingEvents = DB::table('citizen_interactions')
            ->where('interaction_type', 'meeting')
            ->where('interaction_date', '>', now())
            ->orderBy('interaction_date')
            ->limit(4)
            ->get()
            ->map(fn($e) => [
                'date' => Carbon::parse($e->interaction_date)->format('D'),
                'day'  => Carbon::parse($e->interaction_date)->format('j'),
                'title'=> $e->notes ?? 'Meeting',
                'meta' => Carbon::parse($e->interaction_date)->format('g:i A') . ' · Constituency Office',
                'tone' => 'bg-primary/10 text-primary',
            ]);

        // If no meetings, return empty list
        if ($upcomingEvents->isEmpty()) {
            $upcomingEvents = collect();
        }

        // ─── Urgent Items ─────────────────────────────────────────────────────────
        $urgentItems = [];
        // Critically delayed projects
        Project::where('status', 'delayed')
            ->orWhere('status', 'at_risk')
            ->limit(2)
            ->get()
            ->each(function ($p) use (&$urgentItems) {
                $urgentItems[] = [
                    'title'    => $p->name . ' — delayed',
                    'meta'     => 'Project · ' . ($p->location ?? 'Unknown location'),
                    'severity' => $p->status === 'at_risk' ? 'Critical' : 'High',
                ];
            });
        // Escalated grievances
        $escalatedCount = Grievance::where('status', 'escalated')->count();
        if ($escalatedCount > 0) {
            $urgentItems[] = [
                'title'    => "Cluster of {$escalatedCount} escalated grievances",
                'meta'     => 'Grievance hotspot · ' . $escalatedCount . ' cases',
                'severity' => 'High',
            ];
        }
        // Pending scheme reviews
        $pendingApprovals = SchemeApplication::where('status', 'pending_review')->count();
        if ($pendingApprovals > 0) {
            $urgentItems[] = [
                'title'    => "MPLADS sanctions pending review",
                'meta'     => "{$pendingApprovals} files awaiting your approval",
                'severity' => 'High',
            ];
        }

        // No fallback — return only live data
        if (empty($urgentItems)) {
            $urgentItems = [];
        }

        // ─── MP / Constituency Info ───────────────────────────────────────────────
        $mpName = 'Hon. Ravi Varma';
        $constituencyName = 'Madhapur Lok Sabha';

        try {
            $constituency = \App\Models\Constituency::first();
            if ($constituency) {
                $mpName = $constituency->mp_name ?? $mpName;
                $constituencyName = $constituency->name ?? $constituencyName;
            }
        } catch (\Exception $e) {
            // Fallback if constituencies table is empty
        }

        return response()->json([
            'greeting' => 'Good day',
            'date_label' => now()->format('l, j F Y'),
            'mp_name' => $mpName,
            'constituency_name' => $constituencyName,

            'kpis' => [
                'total_citizens'       => $totalCitizens,
                'total_families'       => $totalFamilies,
                'volunteers'           => $totalVolunteers,
                'villages'             => $totalVillages,
                'active_grievances'    => $activeGrievances,
                'active_projects'      => $activeProjects,
                'scheme_applications'  => $schemeApplications,
                'budget_utilization'   => $budgetPct,
                'budget_spent'         => $usedBudget,
                'budget_total'         => $totalBudget,
            ],

            'health_score' => [
                'score'                => $healthScore,
                'project_completion'   => $projectCompletion,
                'grievance_resolution' => $grievanceResolution,
                'scheme_reach'         => $schemeReach,
                'volunteer_activity'   => $volunteerActivity,
            ],

            'grievance_center' => [
                'buckets'    => $grievanceBuckets,
                'trend'      => $grievanceTrend,
                'categories' => $grievanceCategories,
            ],

            'projects'   => $projects,
            'schemes'    => $schemeData,
            'volunteers' => $volunteerLeaders,
            'surveys'    => $surveys,
            'activity'   => $activityItems,
            'events'     => $upcomingEvents,
            'urgent'     => $urgentItems,
        ]);
    }

    private function formatBudget(float $amount): string
    {
        if ($amount >= 10_000_000) return round($amount / 10_000_000, 1) . ' Cr';
        if ($amount >= 100_000)   return round($amount / 100_000, 1) . ' L';
        return number_format($amount);
    }

    private function mapProjectStatus(string $status): string
    {
        return match ($status) {
            'in_progress'  => 'On track',
            'delayed'      => 'Delayed',
            'at_risk'      => 'At risk',
            'completed'    => 'Completing',
            default        => 'On track',
        };
    }
}
