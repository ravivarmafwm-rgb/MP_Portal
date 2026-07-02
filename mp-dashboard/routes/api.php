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

/*
|--------------------------------------------------------------------------
| API Routes — MP Constituency Management System
|--------------------------------------------------------------------------
*/

// ── Public routes ─────────────────────────────────────────────────────────────
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/roles',     [AuthController::class, 'roles']);

// ── Protected routes ──────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::get('/user',             [AuthController::class, 'me']);
    Route::put('/user/profile',     [AuthController::class, 'updateProfile']);
    Route::put('/user/password',    [AuthController::class, 'changePassword']);

    // Role-scoped dashboards
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])
        ->middleware('role:super-admin,mp,mp-staff,constituency-coordinator');
    Route::get('/dashboard/mla/stats', [MlaDashboardController::class, 'stats'])
        ->middleware('role:mla,super-admin');
    Route::get('/dashboard/volunteer/stats', [VolunteerDashboardController::class, 'stats'])
        ->middleware('role:volunteer,super-admin');

    // Citizens
    Route::get('/citizens/stats',   [CitizenController::class, 'stats']);
    Route::get('/citizens',         [CitizenController::class, 'index']);
    Route::get('/citizens/{citizen}', [CitizenController::class, 'show']);
    Route::put('/citizens/{citizen}', [CitizenController::class, 'update']);
    Route::patch('/citizens/{citizen}', [CitizenController::class, 'update']);
    Route::post('/citizens', [CitizenController::class, 'store'])
        ->middleware('role:volunteer,super-admin');

    // Families
    Route::get('/families',  [FamilyController::class, 'index']);
    Route::post('/families', [FamilyController::class, 'store']);

    // Grievances
    Route::get('/grievances/stats',      [GrievanceController::class, 'stats']);
    Route::get('/grievances/categories', [GrievanceController::class, 'categories']);
    Route::apiResource('grievances',     GrievanceController::class)->only(['index', 'show', 'store', 'update']);

    // Projects
    Route::get('/projects/stats',   [ProjectController::class, 'stats']);
    Route::apiResource('projects',  ProjectController::class)->only(['index', 'show']);

    // Volunteers
    Route::get('/volunteers/stats', [VolunteerController::class, 'stats']);
    Route::apiResource('volunteers',VolunteerController::class)->only(['index', 'show']);

    // Schemes
    Route::get('/schemes/stats',         [SchemeController::class, 'stats']);
    Route::get('/schemes/applications',  [SchemeController::class, 'applications']);
    Route::apiResource('schemes',        SchemeController::class)->only(['index', 'show']);

    // Surveys
    Route::get('/surveys/stats',    [SurveyController::class, 'stats']);
    Route::apiResource('surveys',   SurveyController::class)->only(['index', 'show']);

    // Documents
    Route::get('/documents',              [DocumentController::class, 'index']);
    Route::post('/documents/upload',      [DocumentController::class, 'upload']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::get('/documents/{document}/preview',  [DocumentController::class, 'preview']);
    Route::delete('/documents/{document}',       [DocumentController::class, 'destroy']);

    // Notifications
    Route::get('/notifications',                    [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count',       [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::put('/notifications/read-all',         [NotificationController::class, 'markAllRead']);

    // ── Meetings / Appointments / Tours / Janata Darbar ─────────────────────────
    Route::prefix('meetings')->group(function () {
        Route::get('/dashboard',            [MeetingController::class, 'dashboardStats']);
        Route::get('/engagement-analytics', [MeetingController::class, 'engagementAnalytics']);
        Route::get('/calendar',             [MeetingController::class, 'calendar']);

        // Appointments
        Route::get('/appointments',              [MeetingController::class, 'appointments']);
        Route::post('/appointments',             [MeetingController::class, 'storeAppointment']);
        Route::get('/appointments/stats',        [MeetingController::class, 'appointmentStats']);
        Route::get('/appointments/{id}',         [MeetingController::class, 'showAppointment']);
        Route::put('/appointments/{id}',         [MeetingController::class, 'updateAppointment']);
        Route::patch('/appointments/{id}',       [MeetingController::class, 'updateAppointment']);

        // Public meetings
        Route::get('/public-meetings',  [MeetingController::class, 'publicMeetings']);
        Route::post('/public-meetings', [MeetingController::class, 'storePublicMeeting']);

        // Tours
        Route::get('/tours',  [MeetingController::class, 'tours']);
        Route::post('/tours', [MeetingController::class, 'storeTour']);

        // Janata Darbar
        Route::get('/janata-darbar',  [MeetingController::class, 'janataDarbars']);
        Route::post('/janata-darbar', [MeetingController::class, 'storeJanataDarbar']);
    });

    // Locations dropdowns
    Route::get('/departments', function () {
        return response()->json(\App\Models\Department::orderBy('name')->get(['id', 'name', 'code', 'description']));
    });
    Route::prefix('locations')->group(function () {
        Route::get('/constituencies',          [LocationController::class, 'constituencies']);
        Route::get('/assembly-constituencies', [LocationController::class, 'assemblyConstituencies']);
        Route::get('/mandals',                 [LocationController::class, 'mandals']);
        Route::get('/villages',                [LocationController::class, 'villages']);
        Route::get('/wards',                   [LocationController::class, 'wards']);
        Route::get('/polling-booths',          [LocationController::class, 'pollingBooths']);
    });
});
