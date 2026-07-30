<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\CitizenAddress;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\ActivityLog;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CitizenController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Citizen::query()->withTrashed(false);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ilike', "%$search%")
                  ->orWhere('last_name', 'ilike', "%$search%")
                  ->orWhere('mobile_number', 'ilike', "%$search%")
                  ->orWhere('unique_id', 'ilike', "%$search%")
                  ->orWhere('voter_id', 'ilike', "%$search%")
                  ->orWhere('aadhaar_number', 'ilike', "%$search%");
            });
        }

        if ($gender = $request->get('gender')) {
            $query->where('gender', $gender);
        }
        if ($occupation = $request->get('occupation')) {
            $query->where('occupation', 'ilike', "%$occupation%");
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $citizens = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $citizens->items(),
            'meta' => [
                'total' => $citizens->total(),
                'per_page' => $citizens->perPage(),
                'current_page' => $citizens->currentPage(),
                'last_page' => $citizens->lastPage(),
            ],
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $citizen = Citizen::with([
            'addresses.village',
            'addresses.ward',
            'families',
            'grievances.category',
            'schemeApplications.scheme',
            'surveyResponses.survey',
            'interactions',
        ])->findOrFail($id);

        return response()->json($citizen);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'middle_name'     => 'nullable|string|max:100',
            'date_of_birth'   => 'required|date',
            'gender'          => 'required|in:Male,Female,Other',
            'mobile_number'   => ['nullable', 'string', 'max:15', Rule::unique('citizens', 'mobile_number')->whereNotNull('mobile_number')],
            'aadhaar_number'  => ['nullable', 'string', Rule::unique('citizens', 'aadhaar_number')->whereNotNull('aadhaar_number')],
            'voter_id'        => ['nullable', 'string', Rule::unique('citizens', 'voter_id')->whereNotNull('voter_id')],
            'occupation'      => 'nullable|string|max:100',
            'education'       => 'nullable|string|max:100',
            'marital_status'  => 'nullable|string|max:30',
            'father_name'     => 'nullable|string|max:100',
            'mother_name'     => 'nullable|string|max:100',
            'blood_group'     => 'nullable|string|max:5',
            'email'           => 'nullable|email|max:150',
            'is_voter'        => 'boolean',
            // Address
            'village_id'      => 'nullable|uuid|exists:villages,id',
            'ward_id'         => 'nullable|uuid|exists:wards,id',
            'polling_booth_id'=> 'nullable|uuid|exists:polling_booths,id',
            'house_number'    => 'nullable|string',
            'street'          => 'nullable|string',
            'pincode'         => 'nullable|string|max:10',
            'district'        => 'nullable|string|max:100',
            'state'           => 'nullable|string|max:100',
            // Family
            'family_id'       => 'nullable|uuid|exists:families,id',
            'relationship_with_head' => 'nullable|string',
        ]);

        $citizen = Citizen::create([
            'unique_id'    => 'CIT' . strtoupper(Str::random(8)),
            'first_name'   => $data['first_name'],
            'last_name'    => $data['last_name'],
            'middle_name'  => $data['middle_name'] ?? null,
            'date_of_birth'=> $data['date_of_birth'],
            'gender'       => $data['gender'],
            'mobile_number'=> $data['mobile_number'] ?? null,
            'aadhaar_number' => $data['aadhaar_number'] ?? null,
            'voter_id'     => $data['voter_id'] ?? null,
            'occupation'   => $data['occupation'] ?? null,
            'education'    => $data['education'] ?? null,
            'marital_status' => $data['marital_status'] ?? null,
            'father_name'  => $data['father_name'] ?? null,
            'mother_name'  => $data['mother_name'] ?? null,
            'blood_group'  => $data['blood_group'] ?? null,
            'email'        => $data['email'] ?? null,
            'is_voter'     => $data['is_voter'] ?? false,
            'created_by'   => $request->user()->id,
        ]);

        // Save address
        if (!empty($data['village_id']) || !empty($data['pincode'])) {
            CitizenAddress::create([
                'citizen_id'       => $citizen->id,
                'address_type'     => 'permanent',
                'village_id'       => $data['village_id'] ?? null,
                'ward_id'          => $data['ward_id'] ?? null,
                'polling_booth_id' => $data['polling_booth_id'] ?? null,
                'house_number'     => $data['house_number'] ?? null,
                'street'           => $data['street'] ?? null,
                'pincode'          => $data['pincode'] ?? '000000',
                'district'         => $data['district'] ?? 'Unknown',
                'state'            => $data['state'] ?? 'Telangana',
                'is_primary'       => true,
                'created_by'       => $request->user()->id,
            ]);
        }

        // Link to family
        if (!empty($data['family_id'])) {
            FamilyMember::create([
                'family_id'              => $data['family_id'],
                'citizen_id'             => $citizen->id,
                'relationship_with_head' => $data['relationship_with_head'] ?? 'Member',
                'is_head'                => false,
                'created_by'             => $request->user()->id,
            ]);
        }

        // Audit log
        ActivityLog::create([
            'user_id'     => $request->user()->id,
            'action'      => 'citizen_created',
            'description' => "Citizen {$citizen->first_name} {$citizen->last_name} ({$citizen->unique_id}) enrolled",
            'module'      => 'citizens',
        ]);

        NotificationService::notifyRoles(
            ['mp', 'mla', 'mp-staff', 'constituency-coordinator'],
            'New Citizen Enrolled',
            "{$citizen->first_name} {$citizen->last_name} ({$citizen->unique_id}) was enrolled by {$request->user()->name}.",
            'citizen',
            '/citizens/list',
            $citizen,
        );

        return response()->json($citizen->fresh(['addresses', 'families']), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $citizen = Citizen::findOrFail($id);

        $data = $request->validate([
            'first_name'   => 'sometimes|string|max:100',
            'last_name'    => 'sometimes|string|max:100',
            'mobile_number'=> 'nullable|string|max:15',
            'occupation'   => 'nullable|string|max:100',
            'education'    => 'nullable|string|max:100',
            'email'        => 'nullable|email|max:150',
        ]);

        $citizen->update(array_merge($data, ['updated_by' => $request->user()->id]));

        return response()->json($citizen->fresh());
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'        => Citizen::count(),
            'male'         => Citizen::where('gender', 'Male')->count(),
            'female'       => Citizen::where('gender', 'Female')->count(),
            'voters'       => Citizen::where('is_voter', true)->count(),
            'this_month'   => Citizen::whereMonth('created_at', now()->month)->count(),
        ]);
    }
}
