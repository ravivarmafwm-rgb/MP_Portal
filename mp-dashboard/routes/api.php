<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MlaDashboardController;
use App\Http\Controllers\Api\VolunteerDashboardController;
use App\Http\Controllers\Api\CitizenController;
use App\Http\Controllers\Api\FamilyController;
use App\Http\Controllers\Api\GrievanceController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\VolunteerController;
use App\Http\Controllers\Api\SchemeController;
use App\Http\Controllers\Api\SurveyController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\MeetingController;
use App\Http\Controllers\Api\PublicPortalController;
use App\Http\Controllers\Api\VolunteerApplicationController;
use App\Http\Controllers\Api\VolunteerApplicationReviewController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\CommunicationController;
use App\Http\Controllers\Api\CommunicationWebhookController;

/*
|--------------------------------------------------------------------------
| API Routes — MP Constituency Management System
|--------------------------------------------------------------------------
*/

// ── Public routes ─────────────────────────────────────────────────────────────
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:registration');
Route::get('/public/statistics', [PublicPortalController::class, 'statistics'])->middleware('throttle:60,1');
Route::post('/volunteer-applications', [VolunteerApplicationController::class, 'store'])->middleware('throttle:registration');
Route::get('/public/locations/villages', [LocationController::class, 'villages'])->middleware('throttle:60,1');
Route::get('/webhooks/communications/whatsapp', [CommunicationWebhookController::class, 'verifyWhatsApp'])->middleware('throttle:120,1');
Route::post('/webhooks/communications/whatsapp', [CommunicationWebhookController::class, 'whatsapp'])->middleware('throttle:120,1');
Route::post('/webhooks/communications/provider', [CommunicationWebhookController::class, 'provider'])->middleware('throttle:120,1');

// ── Protected routes ──────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::get('/user',             [AuthController::class, 'me']);
    Route::put('/user/profile',     [AuthController::class, 'updateProfile']);
    Route::put('/user/password',    [AuthController::class, 'changePassword'])->middleware('throttle:6,1');
    Route::get('/user/sessions', [AuthController::class, 'sessions']);
    Route::delete('/user/sessions/others', [AuthController::class, 'revokeOtherSessions']);
    Route::delete('/user/sessions/{token}', [AuthController::class, 'revokeSession']);

    // Role-scoped dashboards
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])
        ->middleware('role:super-admin,mp,mp-staff,constituency-coordinator');
    Route::get('/dashboard/mla/stats', [MlaDashboardController::class, 'stats'])
        ->middleware('role:mla,super-admin');
    Route::get('/dashboard/volunteer/stats', [VolunteerDashboardController::class, 'stats'])
        ->middleware('role:volunteer,super-admin');
    Route::get('/analytics/{level}', [AnalyticsController::class, 'show'])->middleware('permission:analytics.view');

    // Citizens
    Route::get('/citizens/stats', [CitizenController::class, 'stats'])->middleware('permission:citizens.view');
    Route::get('/citizens/census', [CitizenController::class, 'census'])->middleware('permission:citizens.view');
    Route::get('/citizens/census/export', [CitizenController::class, 'exportCensus'])->middleware('permission:citizens.view');
    Route::get('/citizens/booth-mapping', [CitizenController::class, 'boothMapping'])->middleware('permission:citizens.view');
    Route::patch('/citizens/{citizen}/booth', [CitizenController::class, 'mapBooth'])->middleware('permission:citizens.update');
    Route::get('/citizens', [CitizenController::class, 'index'])->middleware('permission:citizens.view');
    Route::get('/citizens/{citizen}', [CitizenController::class, 'show'])->middleware('permission:citizens.view');
    Route::put('/citizens/{citizen}', [CitizenController::class, 'update'])->middleware('permission:citizens.update');
    Route::patch('/citizens/{citizen}', [CitizenController::class, 'update'])->middleware('permission:citizens.update');
    Route::post('/citizens', [CitizenController::class, 'store'])
        ->middleware('permission:citizens.create');

    // Families
    Route::get('/families', [FamilyController::class, 'index'])->middleware('permission:families.manage');
    Route::post('/families', [FamilyController::class, 'store'])->middleware('permission:families.manage');

    // Grievances
    Route::get('/grievances/stats', [GrievanceController::class, 'stats'])->middleware('permission:grievances.view');
    Route::get('/grievances/categories', [GrievanceController::class, 'categories'])->middleware('permission:grievances.view');
    Route::get('/grievances/departments', [GrievanceController::class, 'departments'])->middleware('permission:grievances.view');
    Route::get('/grievances/feedback', [GrievanceController::class, 'feedback'])->middleware('permission:grievances.view');
    Route::get('/grievances', [GrievanceController::class, 'index'])->middleware('permission:grievances.view');
    Route::get('/grievances/{grievance}', [GrievanceController::class, 'show'])->middleware('permission:grievances.view');
    Route::post('/grievances', [GrievanceController::class, 'store'])->middleware('permission:grievances.create');
    Route::match(['put', 'patch'], '/grievances/{grievance}', [GrievanceController::class, 'update'])->middleware('permission:grievances.update');

    // Projects
    Route::get('/projects/stats', [ProjectController::class, 'stats'])->middleware('permission:projects.view');
    Route::post('/projects/{project}/progress', [ProjectController::class, 'storeProgress'])->middleware('permission:projects.manage');
    Route::post('/projects/{project}/milestones', [ProjectController::class, 'storeMilestone'])->middleware('permission:projects.manage');
    Route::put('/projects/{project}/milestones/{milestone}', [ProjectController::class, 'updateMilestone'])->middleware('permission:projects.manage');
    Route::delete('/projects/{project}/milestones/{milestone}', [ProjectController::class, 'destroyMilestone'])->middleware('permission:projects.manage');
    Route::post('/projects/{project}/budgets', [ProjectController::class, 'storeBudget'])->middleware('permission:projects.manage');
    Route::put('/projects/{project}/budgets/{budget}', [ProjectController::class, 'updateBudget'])->middleware('permission:projects.manage');
    Route::delete('/projects/{project}/budgets/{budget}', [ProjectController::class, 'destroyBudget'])->middleware('permission:projects.manage');
    Route::post('/projects/{project}/photos', [ProjectController::class, 'storePhoto'])->middleware('permission:projects.manage');
    Route::get('/projects/{project}/photos/{photo}', [ProjectController::class, 'photo'])->middleware('permission:projects.view');
    Route::delete('/projects/{project}/photos/{photo}', [ProjectController::class, 'destroyPhoto'])->middleware('permission:projects.manage');
    Route::apiResource('projects', ProjectController::class)->only(['index', 'show'])->middleware('permission:projects.view');
    Route::apiResource('projects', ProjectController::class)->only(['store','update','destroy'])->middleware('permission:projects.manage');

    // Volunteers
    Route::get('/volunteers/stats', [VolunteerController::class, 'stats'])->middleware('permission:volunteers.view');
    Route::get('/volunteers/activities', [VolunteerController::class, 'activities'])->middleware('permission:volunteers.view');
    Route::get('/volunteers/attendance', [VolunteerController::class, 'attendance'])->middleware('permission:volunteers.view');
    Route::get('/volunteers/performance', [VolunteerController::class, 'performance'])->middleware('permission:volunteers.view');
    Route::get('/volunteers/training', [VolunteerController::class, 'training'])->middleware('permission:volunteers.view');
    Route::get('/volunteers/geographic-coverage', [VolunteerController::class, 'geographicCoverage'])->middleware('permission:volunteers.view');
    Route::get('/volunteers/enrolled-citizens', [VolunteerController::class, 'enrolledCitizens'])->middleware('permission:volunteers.view');
    Route::apiResource('volunteers', VolunteerController::class)->only(['index', 'show'])->middleware('permission:volunteers.view');
    Route::get('/volunteer-applications', [VolunteerApplicationReviewController::class, 'index'])->middleware('permission:volunteers.manage');
    Route::patch('/volunteer-applications/{application}', [VolunteerApplicationReviewController::class, 'review'])->middleware('permission:volunteers.manage');

    // Schemes
    Route::get('/schemes/stats', [SchemeController::class, 'stats'])->middleware('permission:schemes.view');
    Route::get('/schemes/applications', [SchemeController::class, 'applications'])->middleware('permission:schemes.view');
    Route::get('/schemes/applications/{application}', [SchemeController::class, 'showApplication'])->middleware('permission:schemes.view');
    Route::get('/schemes/analytics', [SchemeController::class, 'analytics'])->middleware('permission:schemes.view');
    Route::get('/schemes/beneficiaries', [SchemeController::class, 'beneficiaries'])->middleware('permission:schemes.view');
    Route::get('/schemes/eligibility-rules', [SchemeController::class, 'eligibilityRules'])->middleware('permission:schemes.view');
    Route::apiResource('schemes', SchemeController::class)->only(['index', 'show'])->middleware('permission:schemes.view');
    Route::apiResource('schemes', SchemeController::class)->only(['store', 'update', 'destroy'])->middleware('permission:schemes.manage');

    // Surveys
    Route::get('/surveys/stats', [SurveyController::class, 'stats'])->middleware('permission:surveys.view');
    Route::get('/surveys/responses', [SurveyController::class, 'responses'])->middleware('permission:surveys.view');
    Route::get('/surveys/responses/export', [SurveyController::class, 'exportResponses'])->middleware('permission:surveys.view');
    Route::apiResource('surveys', SurveyController::class)->only(['index', 'show'])->middleware('permission:surveys.view');
    Route::apiResource('surveys', SurveyController::class)->only(['store','update','destroy'])->middleware('permission:surveys.manage');
    Route::post('/surveys/{survey}/publish', [SurveyController::class, 'publish'])->middleware('permission:surveys.manage');
    Route::post('/surveys/{survey}/close', [SurveyController::class, 'close'])->middleware('permission:surveys.manage');
    Route::get('/surveys/{survey}/assignments', [SurveyController::class, 'assignments'])->middleware('permission:surveys.view');
    Route::post('/surveys/{survey}/assignments', [SurveyController::class, 'assign'])->middleware('permission:surveys.manage');
    Route::post('/surveys/{survey}/responses', [SurveyController::class, 'submit'])->middleware('permission:surveys.submit');
    Route::get('/surveys/{survey}/analytics', [SurveyController::class, 'analytics'])->middleware('permission:surveys.view');
    Route::get('/survey-responses/{response}', [SurveyController::class, 'response'])->middleware('permission:surveys.view');
    Route::get('/survey-responses/{response}/details/{detail}/attachment', [SurveyController::class, 'attachment'])->middleware('permission:surveys.view');

    // Documents
    Route::get('/documents', [DocumentController::class, 'index'])->middleware('permission:documents.view');
    Route::get('/document-categories', [DocumentController::class, 'categories'])->middleware('permission:documents.view');
    Route::post('/documents/upload', [DocumentController::class, 'upload'])->middleware('permission:documents.manage');
    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->middleware('permission:documents.view');
    Route::get('/documents/{document}/preview', [DocumentController::class, 'preview'])->middleware('permission:documents.view');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->middleware('permission:documents.manage');

    // Notifications
    Route::get('/notifications',                    [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count',       [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::put('/notifications/read-all',         [NotificationController::class, 'markAllRead']);

    Route::get('/communications/dashboard', [CommunicationController::class, 'dashboard'])->middleware('permission:communications.view');
    Route::get('/communications/templates', [CommunicationController::class, 'templates'])->middleware('permission:communications.view');
    Route::post('/communications/templates', [CommunicationController::class, 'storeTemplate'])->middleware('permission:communications.manage');
    Route::put('/communications/templates/{template}', [CommunicationController::class, 'updateTemplate'])->middleware('permission:communications.manage');
    Route::get('/communications/campaigns', [CommunicationController::class, 'campaigns'])->middleware('permission:communications.view');
    Route::post('/communications/campaigns', [CommunicationController::class, 'storeCampaign'])->middleware('permission:communications.manage');
    Route::post('/communications/consents', [CommunicationController::class, 'recordConsent'])->middleware('permission:communications.manage');
    Route::get('/communications/consents', [CommunicationController::class, 'consents'])->middleware('permission:communications.view');
    Route::get('/communications/contacts', [CommunicationController::class, 'contacts'])->middleware('permission:communications.view');
    Route::post('/communications/campaigns/{campaign}/approve', [CommunicationController::class, 'approve'])->middleware('permission:communications.approve');
    Route::post('/communications/campaigns/{campaign}/dispatch', [CommunicationController::class, 'dispatch'])->middleware('permission:communications.manage');
    Route::post('/communications/campaigns/{campaign}/retry', [CommunicationController::class, 'retry'])->middleware('permission:communications.manage');

    // ── Meetings / Appointments / Tours / Janata Darbar ─────────────────────────
    Route::prefix('meetings')->middleware('permission:meetings.view')->group(function () {
        Route::get('/dashboard',            [MeetingController::class, 'dashboardStats']);
        Route::get('/engagement-analytics', [MeetingController::class, 'engagementAnalytics']);
        Route::get('/calendar',             [MeetingController::class, 'calendar']);

        // Appointments
        Route::get('/appointments',              [MeetingController::class, 'appointments']);
        Route::post('/appointments', [MeetingController::class, 'storeAppointment'])->middleware('permission:meetings.manage');
        Route::get('/appointments/stats',        [MeetingController::class, 'appointmentStats']);
        Route::get('/appointments/{id}',         [MeetingController::class, 'showAppointment']);
        Route::put('/appointments/{id}', [MeetingController::class, 'updateAppointment'])->middleware('permission:meetings.manage');
        Route::patch('/appointments/{id}', [MeetingController::class, 'updateAppointment'])->middleware('permission:meetings.manage');

        // Public meetings
        Route::get('/public-meetings',  [MeetingController::class, 'publicMeetings']);
        Route::post('/public-meetings', [MeetingController::class, 'storePublicMeeting'])->middleware('permission:meetings.manage');

        // Tours
        Route::get('/tours',  [MeetingController::class, 'tours']);
        Route::post('/tours', [MeetingController::class, 'storeTour'])->middleware('permission:meetings.manage');

        // Janata Darbar
        Route::get('/janata-darbar',  [MeetingController::class, 'janataDarbars']);
        Route::post('/janata-darbar', [MeetingController::class, 'storeJanataDarbar'])->middleware('permission:meetings.manage');
    });

    // Locations dropdowns
    Route::get('/departments', function () {
        return response()->json(\App\Models\Department::orderBy('name')->get(['id', 'name', 'code', 'description']));
    })->middleware('permission:locations.view');
    Route::prefix('locations')->middleware('permission:locations.view')->group(function () {
        Route::get('/constituencies',          [LocationController::class, 'constituencies']);
        Route::get('/assembly-constituencies', [LocationController::class, 'assemblyConstituencies']);
        Route::get('/mandals',                 [LocationController::class, 'mandals']);
        Route::get('/villages',                [LocationController::class, 'villages']);
        Route::get('/wards',                   [LocationController::class, 'wards']);
        Route::get('/polling-booths',          [LocationController::class, 'pollingBooths']);
    });
});
