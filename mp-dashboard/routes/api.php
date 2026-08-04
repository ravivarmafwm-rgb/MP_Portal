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
use App\Http\Controllers\Api\ProjectLookupController;
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
use App\Http\Controllers\Api\VolunteerVisitController;

/*
|--------------------------------------------------------------------------
| API Routes — MP Constituency Management System
|--------------------------------------------------------------------------
*/

// ── Public routes ─────────────────────────────────────────────────────────────
Route::get('/auth/csrf', [AuthController::class, 'csrf'])->middleware('throttle:120,1');
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
    Route::get('/user/preferences', [AuthController::class, 'preferences']);
    Route::put('/user/preferences', [AuthController::class, 'updatePreferences']);
    Route::put('/user/password',    [AuthController::class, 'changePassword'])->middleware('throttle:6,1');
    Route::get('/user/sessions', [AuthController::class, 'sessions']);
    Route::delete('/user/sessions/others', [AuthController::class, 'revokeOtherSessions']);
    Route::delete('/user/sessions/{token}', [AuthController::class, 'revokeSession']);
    Route::post('/user/mfa/setup', [AuthController::class, 'mfaSetup'])->middleware('throttle:6,1');
    Route::post('/user/mfa/confirm', [AuthController::class, 'mfaConfirm'])->middleware('throttle:10,1');

    // Role-scoped dashboards
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])
        ->middleware(['role:super-admin,mp,mp-staff,constituency-coordinator','cache.get:60']);
    Route::get('/dashboard/mla/stats', [MlaDashboardController::class, 'stats'])
        ->middleware('role:mla,super-admin');
    Route::get('/dashboard/volunteer/stats', [VolunteerDashboardController::class, 'stats'])
        ->middleware('role:volunteer,super-admin');
    Route::get('/analytics/{level}', [AnalyticsController::class, 'show'])->middleware('permission:analytics.view');

    // Citizens
    Route::get('/citizen/me', [CitizenController::class, 'me'])->middleware('role:citizen');
    Route::get('/citizen/family', [FamilyController::class, 'myFamily'])->middleware('role:citizen');
    Route::get('/citizen/grievances', [GrievanceController::class, 'myGrievances'])->middleware('role:citizen');
    Route::get('/citizen/grievance-categories', [GrievanceController::class, 'citizenCategories'])->middleware('role:citizen');
    Route::post('/citizen/grievances', [GrievanceController::class, 'storeCitizenGrievance'])->middleware(['role:citizen', 'throttle:10,1']);
    Route::post('/citizen/grievances/{grievance}/feedback', [GrievanceController::class, 'submitCitizenFeedback'])->middleware('role:citizen');
    Route::get('/citizens/stats', [CitizenController::class, 'stats'])->middleware('permission:citizens.view');
    Route::get('/citizens/dashboard', [CitizenController::class, 'dashboard'])->middleware('permission:citizens.view')->middleware('cache.get:60');
    Route::get('/citizens/census', [CitizenController::class, 'census'])->middleware('permission:citizens.view');
    Route::get('/citizens/census/export', [CitizenController::class, 'exportCensus'])->middleware('permission:citizens.export');
    Route::get('/citizens/export', [CitizenController::class, 'exportDirectory'])->middleware('permission:citizens.export');
    Route::get('/citizens/booth-mapping', [CitizenController::class, 'boothMapping'])->middleware('permission:citizens.view');
    Route::patch('/citizens/{citizen}/booth', [CitizenController::class, 'mapBooth'])->middleware('permission:citizens.update');
    Route::get('/citizens', [CitizenController::class, 'index'])->middleware('permission:citizens.view');
    Route::get('/citizens/{citizen}/addresses', [CitizenController::class, 'addresses'])->middleware('permission:citizens.view');
    Route::post('/citizens/{citizen}/addresses', [CitizenController::class, 'storeAddress'])->middleware('permission:citizens.update');
    Route::put('/citizens/{citizen}/addresses/{address}', [CitizenController::class, 'updateAddress'])->middleware('permission:citizens.update');
    Route::patch('/citizens/{citizen}/addresses/{address}', [CitizenController::class, 'updateAddress'])->middleware('permission:citizens.update');
    Route::delete('/citizens/{citizen}/addresses/{address}', [CitizenController::class, 'destroyAddress'])->middleware('permission:citizens.update');
    Route::post('/citizens/bulk-update', [CitizenController::class, 'bulkUpdate'])->middleware('permission:citizens.update');
    Route::post('/citizens/bulk-archive', [CitizenController::class, 'bulkArchive'])->middleware('permission:citizens.delete');
    Route::post('/citizens/import', [CitizenController::class, 'import'])->middleware('permission:citizens.import');
    Route::get('/citizens/imports', [CitizenController::class, 'imports'])->middleware('permission:citizens.import');
    Route::get('/citizens/imports/{batch}/errors', [CitizenController::class, 'importErrors'])->middleware('permission:citizens.import');
    Route::get('/citizens/imports/{batch}', [CitizenController::class, 'importShow'])->middleware('permission:citizens.import');
    Route::get('/citizens/{citizen}', [CitizenController::class, 'show'])->middleware('permission:citizens.view');
    Route::put('/citizens/{citizen}', [CitizenController::class, 'update'])->middleware('permission:citizens.update');
    Route::patch('/citizens/{citizen}', [CitizenController::class, 'update'])->middleware('permission:citizens.update');
    Route::delete('/citizens/{citizen}', [CitizenController::class, 'destroy'])->middleware('permission:citizens.delete');
    Route::post('/citizens', [CitizenController::class, 'store'])
        ->middleware('permission:citizens.create');

    // Families
    Route::get('/families', [FamilyController::class, 'index'])->middleware('permission:families.manage');
    Route::post('/families', [FamilyController::class, 'store'])->middleware('permission:families.manage');
    Route::get('/families/{family}', [FamilyController::class, 'show'])->middleware('permission:families.manage');
    Route::get('/families/{family}/dashboard', [FamilyController::class, 'dashboard'])->middleware('permission:families.manage');
    Route::put('/families/{family}', [FamilyController::class, 'update'])->middleware('permission:families.manage');
    Route::delete('/families/{family}', [FamilyController::class, 'destroy'])->middleware('permission:families.manage');
    Route::post('/families/{family}/members', [FamilyController::class, 'addMember'])->middleware('permission:families.manage');
    Route::put('/families/{family}/members/{member}', [FamilyController::class, 'updateMember'])->middleware('permission:families.manage');
    Route::delete('/families/{family}/members/{member}', [FamilyController::class, 'removeMember'])->middleware('permission:families.manage');

    // Grievances
    Route::get('/grievances/stats', [GrievanceController::class, 'stats'])->middleware('permission:grievances.view');
    Route::get('/grievances/analytics', [GrievanceController::class, 'analytics'])->middleware('permission:grievances.view');
    Route::get('/grievances/categories', [GrievanceController::class, 'categories'])->middleware('permission:grievances.view');
    Route::get('/grievances/departments', [GrievanceController::class, 'departments'])->middleware('permission:grievances.view');
    Route::get('/grievances/feedback', [GrievanceController::class, 'feedback'])->middleware('permission:grievances.view');
    Route::get('/grievances', [GrievanceController::class, 'index'])->middleware('permission:grievances.view');
    Route::get('/grievances/{grievance}', [GrievanceController::class, 'show'])->middleware('permission:grievances.view');
    Route::post('/grievances', [GrievanceController::class, 'store'])->middleware('permission:grievances.create');
    Route::get('/grievances/{grievance}/assignment-options', [GrievanceController::class, 'assignmentOptions'])->middleware('permission:grievances.update');
    Route::post('/grievances/{grievance}/assign', [GrievanceController::class, 'assign'])->middleware('permission:grievances.update');
    Route::post('/grievances/{grievance}/escalate', [GrievanceController::class, 'escalate'])->middleware('permission:grievances.update');
    Route::post('/grievances/{grievance}/assignments/{assignment}/respond', [GrievanceController::class, 'respondToAssignment'])->middleware('permission:grievances.update');
    Route::post('/grievances/{grievance}/resolve', [GrievanceController::class, 'resolve'])->middleware('permission:grievances.update');
    Route::post('/grievances/{grievance}/close', [GrievanceController::class, 'close'])->middleware('permission:grievances.update');
    Route::post('/grievances/{grievance}/reopen', [GrievanceController::class, 'reopen'])->middleware('permission:grievances.update');
    Route::post('/grievances/{grievance}/notes', [GrievanceController::class, 'addNote'])->middleware('permission:grievances.update');
    Route::match(['put', 'patch'], '/grievances/{grievance}', [GrievanceController::class, 'update'])->middleware('permission:grievances.update');

    // Projects
    Route::get('/projects/budget-summary', [ProjectController::class, 'budgetSummary'])->middleware('permission:projects.view');
    Route::get('/projects/budget-export', [ProjectController::class, 'exportBudget'])->middleware('permission:projects.view');
    Route::get('/projects/financial-export', [ProjectController::class, 'exportFinancial'])->middleware('permission:projects.view');
    Route::get('/projects/{project}/allocation-history', [ProjectController::class, 'allocationHistory'])->middleware('permission:projects.view');
    Route::prefix('project-lookups/{lookup}')->middleware('permission:projects.manage')->group(function () {
        Route::get('/', [ProjectLookupController::class, 'index']);
        Route::post('/', [ProjectLookupController::class, 'store']);
        Route::put('/{id}', [ProjectLookupController::class, 'update']);
        Route::delete('/{id}', [ProjectLookupController::class, 'destroy']);
        Route::post('/{id}/restore', [ProjectLookupController::class, 'restore']);
    });
    Route::get('/projects/stats', [ProjectController::class, 'stats'])->middleware('permission:projects.view');
    Route::get('/projects/{project}/workflow', [ProjectController::class, 'workflow'])->middleware('permission:projects.view');
    Route::post('/projects/{project}/workflow', [ProjectController::class, 'storeWorkflow'])->middleware('permission:projects.manage');
    Route::put('/projects/{project}/workflow/{entry}', [ProjectController::class, 'updateWorkflow'])->middleware('permission:projects.manage');
    Route::delete('/projects/{project}/workflow/{entry}', [ProjectController::class, 'destroyWorkflow'])->middleware('permission:projects.manage');
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
    Route::get('/volunteer-visits/stats', [VolunteerVisitController::class, 'stats'])->middleware('permission:volunteer_visits.view');
    Route::get('/volunteer-visits', [VolunteerVisitController::class, 'index'])->middleware('permission:volunteer_visits.view');
    Route::post('/volunteer-visits', [VolunteerVisitController::class, 'store'])->middleware('permission:volunteer_visits.manage');
    Route::get('/volunteer-visits/{visit}', [VolunteerVisitController::class, 'show'])->middleware('permission:volunteer_visits.view');
    Route::put('/volunteer-visits/{visit}', [VolunteerVisitController::class, 'update'])->middleware('permission:volunteer_visits.update');
    Route::post('/volunteer-visits/{visit}/check-in', [VolunteerVisitController::class, 'checkIn'])->middleware('permission:volunteer_visits.update');
    Route::post('/volunteer-visits/{visit}/complete', [VolunteerVisitController::class, 'complete'])->middleware('permission:volunteer_visits.update');
    Route::get('/volunteer-visits/{visit}/attachments/{index}', [VolunteerVisitController::class, 'downloadAttachment'])->middleware('permission:volunteer_visits.view');
    Route::delete('/volunteer-visits/{visit}/attachments/{index}', [VolunteerVisitController::class, 'deleteAttachment'])->middleware('permission:volunteer_visits.update');
    Route::apiResource('volunteers', VolunteerController::class)->only(['index', 'show'])->middleware('permission:volunteers.view');
    Route::get('/volunteer-applications', [VolunteerApplicationReviewController::class, 'index'])->middleware('permission:volunteers.manage');
    Route::patch('/volunteer-applications/{application}', [VolunteerApplicationReviewController::class, 'review'])->middleware('permission:volunteers.manage');

    // Schemes
    Route::get('/schemes/stats', [SchemeController::class, 'stats'])->middleware('permission:schemes.view');
    Route::get('/schemes/applications', [SchemeController::class, 'applications'])->middleware('permission:schemes.view');
    Route::get('/schemes/applications/{application}', [SchemeController::class, 'showApplication'])->middleware('permission:schemes.view');
    Route::post('/schemes/applications/{application}/review', [SchemeController::class, 'reviewApplication'])->middleware('permission:schemes.manage');
    Route::post('/schemes/applications/{application}/disbursements', [SchemeController::class, 'storeDisbursement'])->middleware('permission:schemes.manage');
    Route::post('/schemes/disbursements/{disbursement}/transition', [SchemeController::class, 'transitionDisbursement'])->middleware('permission:schemes.manage');
    Route::get('/schemes/analytics', [SchemeController::class, 'analytics'])->middleware('permission:schemes.view');
    Route::get('/schemes/beneficiaries', [SchemeController::class, 'beneficiaries'])->middleware('permission:schemes.view');
    Route::get('/schemes/eligibility-rules', [SchemeController::class, 'eligibilityRules'])->middleware('permission:schemes.view');
    Route::post('/schemes/{scheme}/eligibility-rules', [SchemeController::class, 'storeEligibilityRule'])->middleware('permission:schemes.manage');
    Route::put('/schemes/{scheme}/eligibility-rules/{eligibilityRule}', [SchemeController::class, 'updateEligibilityRule'])->middleware('permission:schemes.manage');
    Route::delete('/schemes/{scheme}/eligibility-rules/{eligibilityRule}', [SchemeController::class, 'destroyEligibilityRule'])->middleware('permission:schemes.manage');
    Route::post('/schemes/{scheme}/required-documents', [SchemeController::class, 'storeRequiredDocument'])->middleware('permission:schemes.manage');
    Route::put('/schemes/{scheme}/required-documents/{requiredDocument}', [SchemeController::class, 'updateRequiredDocument'])->middleware('permission:schemes.manage');
    Route::delete('/schemes/{scheme}/required-documents/{requiredDocument}', [SchemeController::class, 'destroyRequiredDocument'])->middleware('permission:schemes.manage');
    Route::apiResource('schemes', SchemeController::class)->only(['index', 'show'])->middleware('permission:schemes.view');
    Route::apiResource('schemes', SchemeController::class)->only(['store', 'update', 'destroy'])->middleware('permission:schemes.manage');
    Route::get('/citizen/schemes', [SchemeController::class, 'citizenSchemes'])->middleware('role:citizen');
    Route::get('/citizen/scheme-applications', [SchemeController::class, 'myApplications'])->middleware('role:citizen');
    Route::post('/citizen/scheme-applications', [SchemeController::class, 'applyAsCitizen'])->middleware(['role:citizen', 'throttle:10,1']);
    Route::post('/citizen/scheme-applications/{application}/documents', [SchemeController::class, 'uploadApplicationDocument'])->middleware(['role:citizen', 'throttle:20,1']);
    Route::post('/schemes/applications/assisted', [SchemeController::class, 'applyForCitizen'])->middleware(['permission:schemes.apply', 'throttle:20,1']);
    Route::post('/schemes/applications/{application}/documents', [SchemeController::class, 'uploadApplicationDocument'])->middleware(['permission:schemes.view', 'throttle:20,1']);
    Route::post('/citizen/scheme-applications/{application}/withdraw', [SchemeController::class, 'withdrawApplication'])->middleware(['role:citizen', 'throttle:10,1']);
    Route::post('/schemes/application-document-reviews/{documentReview}', [SchemeController::class, 'reviewApplicationDocument'])->middleware('permission:schemes.manage');

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
    Route::get('/documents/search', [DocumentController::class, 'search'])->middleware('permission:documents.view');
    Route::get('/document-categories', [DocumentController::class, 'categories'])->middleware('permission:documents.view');
    Route::post('/documents/upload', [DocumentController::class, 'upload'])->middleware('permission:documents.manage');
    Route::get('/documents/{document}/versions', [DocumentController::class, 'versions']);
    Route::post('/documents/{document}/versions', [DocumentController::class, 'uploadVersion'])->middleware('permission:documents.manage');
    Route::get('/documents/{document}/versions/{version}/download', [DocumentController::class, 'downloadVersion']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);
    Route::get('/documents/{document}/preview', [DocumentController::class, 'preview']);
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
        Route::get('/dashboard',            [MeetingController::class, 'dashboardStats'])->middleware('cache.get:60');
        Route::get('/engagement-analytics', [MeetingController::class, 'engagementAnalytics'])->middleware('cache.get:120');
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
