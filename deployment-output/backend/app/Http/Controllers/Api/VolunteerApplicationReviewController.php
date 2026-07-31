<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Volunteer\ReviewVolunteerApplicationRequest;
use App\Models\Role;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\VolunteerApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Services\GeographicScopeService;

class VolunteerApplicationReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = VolunteerApplication::with(['village:id,name', 'ward:id,name', 'reviewer:id,name']);
        app(GeographicScopeService::class)->apply($query, $request->user());
        if ($status = $request->string('status')->toString()) $query->where('status', $status);
        $results = $query->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));
        return response()->json(['data' => $results->items(), 'meta' => ['total' => $results->total(), 'current_page' => $results->currentPage(), 'last_page' => $results->lastPage(), 'per_page' => $results->perPage()]]);
    }

    public function review(ReviewVolunteerApplicationRequest $request, VolunteerApplication $application): JsonResponse
    {
        abort_unless($application->status === 'pending', 409, 'This application has already been reviewed.');
        abort_unless(app(GeographicScopeService::class)->allowsVillage($request->user(), $application->village_id, $application->ward_id), 403, 'This application is outside your assigned area.');
        $data = $request->validated();
        if ($data['decision'] === 'rejected') {
            $application->update(['status' => 'rejected', 'review_notes' => $data['review_notes'] ?? null, 'reviewed_by' => $request->user()->id, 'reviewed_at' => now()]);
            return response()->json(['message' => 'Volunteer application rejected.']);
        }

        $user = DB::transaction(function () use ($application, $request, $data) {
            $role = Role::where('slug', 'volunteer')->where('is_active', true)->firstOrFail();
            $user = User::create(['name' => $application->first_name.' '.$application->last_name, 'email' => $application->email, 'password' => Hash::make(Str::random(64)), 'role_id' => $role->id, 'village_id' => $application->village_id, 'ward_id' => $application->ward_id, 'created_by' => $request->user()->id]);
            Volunteer::create(['user_id' => $user->id, 'volunteer_id' => 'VOL-'.strtoupper(Str::random(10)), 'first_name' => $application->first_name, 'last_name' => $application->last_name, 'date_of_birth' => $application->date_of_birth, 'gender' => $application->gender, 'mobile_number' => $application->mobile_number, 'email' => $application->email, 'village_id' => $application->village_id, 'ward_id' => $application->ward_id, 'address' => $application->address, 'joining_date' => now()->toDateString(), 'status' => 'active', 'created_by' => $request->user()->id]);
            $application->update(['status' => 'approved', 'review_notes' => $data['review_notes'] ?? null, 'reviewed_by' => $request->user()->id, 'reviewed_at' => now()]);
            return $user;
        });

        $status = Password::sendResetLink(['email' => $user->email]);
        return response()->json(['message' => $status === Password::RESET_LINK_SENT ? 'Application approved and account setup email sent.' : 'Application approved, but the account setup email could not be sent.', 'setup_email_sent' => $status === Password::RESET_LINK_SENT]);
    }
}
