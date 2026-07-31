<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ParliamentaryAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function show(Request $request, string $level, ParliamentaryAnalyticsService $analytics): JsonResponse
    {
        abort_unless(in_array($level, ['constituency', 'assembly', 'mandal', 'village', 'booth'], true), 404);
        abort_unless($request->user()->hasPermission('analytics.view'), 403);
        return response()->json($analytics->report($request->user(), $level));
    }
}
