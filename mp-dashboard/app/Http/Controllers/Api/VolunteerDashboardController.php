<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Grievance;
use App\Models\Notification;
use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Models\Volunteer;
use App\Models\VolunteerActivity;
use App\Models\VolunteerAttendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerDashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $volunteer = Volunteer::with(['village.mandal', 'ward', 'pollingBooth'])
            ->where('user_id', $user->id)
            ->first();

        $villageId = $volunteer?->village_id;
        $today = now()->toDateString();

        $myCitizens = Citizen::where('created_by', $user->id);
        $villageCitizens = $villageId
            ? Citizen::whereHas('addresses', fn ($q) => $q->where('village_id', $villageId))
            : Citizen::whereRaw('1=0');

        $myGrievances = Grievance::where('created_by', $user->id);
        $mySurveys = SurveyResponse::where('volunteer_id', $volunteer?->id);
        $myAttendance = VolunteerAttendance::where('volunteer_id', $volunteer?->id);
        $myTasks = VolunteerActivity::where('volunteer_id', $volunteer?->id);

        return response()->json([
            'greeting'      => 'Good day',
            'date_label'    => now()->format('l, j F Y'),
            'volunteer_name'=> $volunteer
                ? trim("{$volunteer->first_name} {$volunteer->last_name}")
                : $user->name,
            'volunteer_id'  => $volunteer?->volunteer_id,
            'assigned_village' => $volunteer?->village?->name,
            'assigned_mandal'  => $volunteer?->village?->mandal?->name,

            'kpis' => [
                'my_tasks'              => (clone $myTasks)->where('status', 'pending')->count(),
                'assigned_citizens'     => (clone $myCitizens)->count(),
                'village_citizens'      => (clone $villageCitizens)->count(),
                'registrations_today'   => (clone $myCitizens)->whereDate('created_at', $today)->count(),
                'complaints_today'      => (clone $myGrievances)->whereDate('created_at', $today)->count(),
                'surveys_completed'     => (clone $mySurveys)->count(),
                'attendance_this_month' => (clone $myAttendance)
                    ->whereMonth('attendance_date', now()->month)
                    ->where('status', 'present')
                    ->count(),
                'unread_notifications'  => Notification::where('user_id', $user->id)->where('is_read', false)->count(),
            ],

            'tasks' => VolunteerActivity::where('volunteer_id', $volunteer?->id)
                ->orderByDesc('activity_date')
                ->limit(10)
                ->get(),

            'assigned_citizens' => Citizen::where('created_by', $user->id)
                ->orderByDesc('created_at')
                ->limit(10)
                ->get(['id', 'unique_id', 'first_name', 'last_name', 'mobile_number', 'created_at']),

            'attendance' => VolunteerAttendance::where('volunteer_id', $volunteer?->id)
                ->orderByDesc('attendance_date')
                ->limit(7)
                ->get(),

            'surveys' => Survey::where('status', 'active')
                ->withCount('responses')
                ->limit(5)
                ->get(),

            'recent_complaints' => Grievance::where('created_by', $user->id)
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(['id', 'grievance_number', 'subject', 'status', 'created_at']),

            'notifications' => Notification::where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->limit(8)
                ->get(),
        ]);
    }
}
