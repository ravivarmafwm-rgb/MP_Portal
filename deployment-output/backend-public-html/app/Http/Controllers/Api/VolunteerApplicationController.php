<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\VolunteerApplicationRequest;
use App\Models\VolunteerApplication;
use Illuminate\Http\JsonResponse;

class VolunteerApplicationController extends Controller
{
    public function store(VolunteerApplicationRequest $request): JsonResponse
    {
        $application = VolunteerApplication::create($request->validated());
        return response()->json(['id' => $application->id, 'status' => $application->status, 'message' => 'Your volunteer application has been submitted for review.'], 201);
    }
}
