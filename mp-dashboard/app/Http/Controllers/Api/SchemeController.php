<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Scheme;
use App\Models\SchemeApplication;
use App\Models\SchemeBeneficiary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchemeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Scheme::with(['department']);

        if ($search = $request->get('search')) {
            $query->where('name', 'ilike', "%$search%");
        }
        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }
        if ($request->boolean('active_only', false)) {
            $query->where('is_active', true);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $results = $query->orderBy('name')->paginate($perPage);

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
        $scheme = Scheme::with([
            'department',
            'applications' => fn($q) => $q->limit(10)->orderByDesc('created_at'),
            'beneficiaries' => fn($q) => $q->limit(10),
        ])->findOrFail($id);

        $scheme->total_applications = SchemeApplication::where('scheme_id', $id)->count();
        $scheme->approved_count     = SchemeApplication::where('scheme_id', $id)->where('status', 'approved')->count();
        $scheme->total_beneficiaries= SchemeBeneficiary::where('scheme_id', $id)->where('status', 'active')->count();

        return response()->json($scheme);
    }

    public function applications(Request $request): JsonResponse
    {
        $query = SchemeApplication::with(['scheme', 'citizen', 'village']);

        if ($schemeId = $request->get('scheme_id')) {
            $query->where('scheme_id', $schemeId);
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
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

    public function stats(): JsonResponse
    {
        return response()->json([
            'total_schemes'      => Scheme::count(),
            'active_schemes'     => Scheme::where('is_active', true)->count(),
            'total_applications' => SchemeApplication::count(),
            'approved'           => SchemeApplication::where('status', 'approved')->count(),
            'pending'            => SchemeApplication::where('status', 'pending')->count(),
            'rejected'           => SchemeApplication::where('status', 'rejected')->count(),
            'total_beneficiaries'=> SchemeBeneficiary::where('status', 'active')->count(),
        ]);
    }
}
