<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\CitizenAddress;
use App\Models\Family;
use App\Models\FamilyMember;
use App\Models\ActivityLog;
use App\Services\NotificationService;
use App\Services\GeographicScopeService;
use App\Http\Requests\Citizen\MapCitizenBoothRequest;
use App\Http\Resources\CitizenBoothResource;
use App\Models\PollingBooth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CitizenController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Citizen::class);
        $query = Citizen::query();
        app(GeographicScopeService::class)->apply($query, $request->user());

        if ($search = $request->get('search')) {
            $aadhaarDigits = preg_replace('/\D/', '', $search);
            $query->where(function ($q) use ($search, $aadhaarDigits) {
                $q->where('first_name', 'ilike', "%$search%")
                  ->orWhere('last_name', 'ilike', "%$search%")
                  ->orWhere('mobile_number', 'ilike', "%$search%")
                  ->orWhere('unique_id', 'ilike', "%$search%")
                  ->orWhere('voter_id', 'ilike', "%$search%");
                if (strlen($aadhaarDigits) === 12) {
                    $q->orWhere('aadhaar_hash', hash_hmac('sha256', $aadhaarDigits, config('app.key')));
                }
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
            'addresses.village.mandal',
            'addresses.ward',
            'families.village.mandal',
            'families.familyMembers.citizen',
            'grievances.category',
            'schemeApplications.scheme.department',
            'surveyResponses.survey',
            'interactions',
            'documents.category',
            'activityLogs' => fn ($query) => $query->with('user:id,name')->latest(),
        ])->findOrFail($id);
        $this->authorize('view', $citizen);

        return response()->json($citizen);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Citizen::class);
        $data = $request->validate([
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'middle_name'     => 'nullable|string|max:100',
            'date_of_birth'   => 'required|date',
            'gender'          => 'required|in:Male,Female,Other',
            'mobile_number'   => ['nullable', 'string', 'max:15', Rule::unique('citizens', 'mobile_number')->whereNotNull('mobile_number')],
            'aadhaar_number'  => ['nullable', 'regex:/^[0-9]{12}$/'],
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

        if (!empty($data['aadhaar_number']) && Citizen::where('aadhaar_hash', hash_hmac('sha256', $data['aadhaar_number'], config('app.key')))->exists()) {
            throw ValidationException::withMessages(['aadhaar_number' => ['This Aadhaar number is already registered.']]);
        }
        abort_unless(app(GeographicScopeService::class)->allowsVillage($request->user(), $data['village_id'] ?? null, $data['ward_id'] ?? null), 403, 'The selected location is outside your assigned area.');

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
        $this->authorize('update', $citizen);

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

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Citizen::class);
        $base = Citizen::query();
        app(GeographicScopeService::class)->apply($base, $request->user());
        return response()->json([
            'total' => (clone $base)->count(),
            'male' => (clone $base)->whereRaw('LOWER(gender) = ?', ['male'])->count(),
            'female' => (clone $base)->whereRaw('LOWER(gender) = ?', ['female'])->count(),
            'voters' => (clone $base)->where('is_voter', true)->count(),
            'this_month' => (clone $base)->where('created_at', '>=', now()->startOfMonth())->count(),
        ]);
    }

    public function census(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Citizen::class);
        return response()->json($this->censusData($request));
    }

    public function exportCensus(Request $request): StreamedResponse
    {
        $this->authorize('viewAny', Citizen::class);
        $data = $this->censusData($request);
        return response()->streamDownload(function () use ($data): void {
            $handle = fopen('php://output', 'wb');
            fputcsv($handle, ['Constituency Census Report', now()->toDateTimeString()]);
            fputcsv($handle, ['Metric', 'Value']);
            foreach (['total_citizens','male','female','other_gender','voters','households','bpl_households','with_aadhaar','with_voter_id','with_mobile','with_education','with_occupation','persons_with_disability','children','working_age','senior_citizens'] as $key) fputcsv($handle, [str_replace('_', ' ', ucfirst($key)), $data[$key]]);
            fputcsv($handle, []); fputcsv($handle, ['Education', 'Citizens']);
            foreach ($data['education_breakdown'] as $row) fputcsv($handle, [$row['label'], $row['count']]);
            fputcsv($handle, []); fputcsv($handle, ['Occupation', 'Citizens']);
            foreach ($data['occupation_breakdown'] as $row) fputcsv($handle, [$row['label'], $row['count']]);
            fclose($handle);
        }, 'constituency-census-'.now()->format('Y-m-d-His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function censusData(Request $request): array
    {
        $citizens = Citizen::query();
        app(GeographicScopeService::class)->apply($citizens, $request->user());
        $families = Family::query();
        app(GeographicScopeService::class)->apply($families, $request->user());
        $breakdown = function (string $column) use ($citizens): array {
            return (clone $citizens)->whereNotNull($column)->where($column, '<>', '')
                ->select($column, DB::raw('count(*) as aggregate'))->groupBy($column)->orderByDesc('aggregate')->limit(10)->get()
                ->map(fn ($row) => ['label' => $row->{$column}, 'count' => (int) $row->aggregate])->all();
        };
        return [
            'total_citizens' => (clone $citizens)->count(),
            'male' => (clone $citizens)->whereRaw('LOWER(gender) = ?', ['male'])->count(),
            'female' => (clone $citizens)->whereRaw('LOWER(gender) = ?', ['female'])->count(),
            'other_gender' => (clone $citizens)->whereRaw('LOWER(gender) NOT IN (?, ?)', ['male','female'])->count(),
            'voters' => (clone $citizens)->where('is_voter', true)->count(),
            'households' => (clone $families)->count(),
            'bpl_households' => (clone $families)->where('is_bpl', true)->count(),
            'with_aadhaar' => (clone $citizens)->whereNotNull('aadhaar_hash')->count(),
            'with_voter_id' => (clone $citizens)->whereNotNull('voter_id')->where('voter_id', '<>', '')->count(),
            'with_mobile' => (clone $citizens)->whereNotNull('mobile_number')->where('mobile_number', '<>', '')->count(),
            'with_education' => (clone $citizens)->whereNotNull('education')->where('education', '<>', '')->count(),
            'with_occupation' => (clone $citizens)->whereNotNull('occupation')->where('occupation', '<>', '')->count(),
            'persons_with_disability' => (clone $citizens)->whereNotIn('disability_status', ['none',''])->whereNotNull('disability_status')->count(),
            'children' => (clone $citizens)->where('date_of_birth', '>', now()->subYears(18)->toDateString())->count(),
            'working_age' => (clone $citizens)->whereBetween('date_of_birth', [now()->subYears(60)->toDateString(), now()->subYears(18)->toDateString()])->count(),
            'senior_citizens' => (clone $citizens)->where('date_of_birth', '<', now()->subYears(60)->toDateString())->count(),
            'education_breakdown' => $breakdown('education'),
            'occupation_breakdown' => $breakdown('occupation'),
            'generated_at' => now()->toIso8601String(),
        ];
    }

    public function boothMapping(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Citizen::class);
        $query = Citizen::with(['addresses' => fn ($addresses) => $addresses->with(['village:id,name', 'ward:id,name', 'pollingBooth:id,name,booth_number'])->orderByDesc('is_primary')]);
        app(GeographicScopeService::class)->apply($query, $request->user());
        if ($search = trim((string) $request->get('search'))) $query->where(fn ($citizens) => $citizens->where('first_name', 'ilike', "%{$search}%")->orWhere('last_name', 'ilike', "%{$search}%")->orWhere('unique_id', 'ilike', "%{$search}%")->orWhere('mobile_number', 'ilike', "%{$search}%"));
        if ($request->get('mapping_status') === 'mapped') $query->whereHas('addresses', fn ($addresses) => $addresses->whereNotNull('polling_booth_id'));
        if ($request->get('mapping_status') === 'unmapped') $query->whereHas('addresses', fn ($addresses) => $addresses->whereNull('polling_booth_id'));
        $results = $query->orderBy('first_name')->paginate(min(max((int) $request->get('per_page', 20), 1), 100));
        return response()->json(['data' => CitizenBoothResource::collection($results->getCollection())->resolve(), 'meta' => ['total' => $results->total(), 'per_page' => $results->perPage(), 'current_page' => $results->currentPage(), 'last_page' => $results->lastPage()]]);
    }

    public function mapBooth(MapCitizenBoothRequest $request, string $id): JsonResponse
    {
        $citizen = Citizen::findOrFail($id); $this->authorize('update', $citizen); $data = $request->validated();
        $address = CitizenAddress::whereKey($data['address_id'])->where('citizen_id', $citizen->id)->firstOrFail();
        $booth = PollingBooth::with('ward:id,village_id')->findOrFail($data['polling_booth_id']);
        abort_unless($booth->ward?->village_id === $address->village_id, 422, 'The polling booth is not in the citizen address village.');
        abort_unless(app(GeographicScopeService::class)->allowsVillage($request->user(), $address->village_id, $address->ward_id), 403, 'The citizen address is outside your assigned area.');
        DB::transaction(function () use ($address, $booth, $request, $citizen) {
            $old = $address->polling_booth_id; $address->update(['polling_booth_id' => $booth->id, 'updated_by' => $request->user()->id]);
            ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Citizen::class, 'loggable_id' => $citizen->id, 'action' => 'booth_mapped', 'module' => 'citizens', 'description' => 'Citizen polling booth mapping updated', 'old_values' => ['polling_booth_id' => $old], 'new_values' => ['polling_booth_id' => $booth->id], 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
        });
        return response()->json(['message' => 'Polling booth mapping updated.']);
    }
}
