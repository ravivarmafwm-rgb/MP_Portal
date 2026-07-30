<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Survey::with(['constituency']);

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }
        if ($search = $request->get('search')) {
            $query->where('title', 'ilike', "%$search%");
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $results = $query->orderByDesc('created_at')->paginate($perPage);

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
        $survey = Survey::with(['questions', 'constituency'])->findOrFail($id);
        $survey->response_count = SurveyResponse::where('survey_id', $id)->count();

        return response()->json($survey);
    }

    public function responses(Request $request): JsonResponse
    {
        $query = SurveyResponse::with(['survey', 'citizen', 'volunteer', 'village', 'ward']);

        if ($surveyId = $request->get('survey_id')) {
            $query->where('survey_id', $surveyId);
        }

        if ($search = $request->get('search')) {
            $query->where(function ($responseQuery) use ($search) {
                $responseQuery
                    ->where('respondent_name', 'ilike', "%{$search}%")
                    ->orWhere('respondent_mobile', 'ilike', "%{$search}%")
                    ->orWhereHas('citizen', function ($citizenQuery) use ($search) {
                        $citizenQuery
                            ->where('first_name', 'ilike', "%{$search}%")
                            ->orWhere('last_name', 'ilike', "%{$search}%");
                    })
                    ->orWhereHas('village', function ($villageQuery) use ($search) {
                        $villageQuery->where('name', 'ilike', "%{$search}%");
                    });
            });
        }

        $perPage = min(max((int) $request->get('per_page', 20), 1), 100);
        $results = $query->orderByDesc('response_date')->orderByDesc('created_at')->paginate($perPage);

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

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'         => Survey::count(),
            'active'        => Survey::where('status', 'active')->count(),
            'draft'         => Survey::where('status', 'draft')->count(),
            'total_responses'=> SurveyResponse::count(),
            'this_month'    => SurveyResponse::whereMonth('created_at', now()->month)->count(),
        ]);
    }
}
