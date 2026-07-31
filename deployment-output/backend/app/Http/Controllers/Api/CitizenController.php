<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\CitizenAddress;
use App\Models\Family;
use App\Models\ActivityLog;
use App\Services\GeographicScopeService;
use App\Http\Requests\Citizen\MapCitizenBoothRequest;
use App\Http\Requests\Citizen\StoreCitizenRequest;
use App\Http\Requests\Citizen\UpdateCitizenRequest;
use App\Http\Requests\Citizen\ImportCitizensRequest;
use App\Http\Requests\Citizen\BulkUpdateCitizensRequest;
use App\Http\Requests\Citizen\BulkArchiveCitizensRequest;
use App\Http\Requests\Citizen\SaveCitizenAddressRequest;
use App\Services\CitizenEnrollmentService;
use App\Services\CitizenAddressService;
use App\Jobs\ProcessCitizenImport;
use App\Models\CitizenImportBatch;
use App\Models\CitizenImportRow;
use App\Http\Resources\CitizenBoothResource;
use App\Http\Resources\CitizenSelfResource;
use App\Http\Resources\CitizenResource;
use App\Http\Resources\CitizenAddressResource;
use App\Models\PollingBooth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CitizenController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        abort_unless($request->user()->hasRole('citizen'), 403);
        abort_unless($request->user()->citizen_id, 409, 'This account is not linked to a citizen record. Contact the constituency office.');
        $citizen = Citizen::with(['addresses.village:id,name', 'addresses.ward:id,name'])
            ->withCount(['grievances', 'schemeApplications', 'surveyResponses', 'documents'])
            ->findOrFail($request->user()->citizen_id);
        $this->authorize('view', $citizen);

        return response()->json((new CitizenSelfResource($citizen))->resolve($request));
    }
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
        if ($request->filled('is_voter')) {
            $query->where('is_voter', filter_var($request->get('is_voter'), FILTER_VALIDATE_BOOLEAN));
        }
        if ($village = $request->get('village_id')) {
            $query->whereHas('addresses', fn ($addresses) => $addresses->where('village_id', $village));
        }
        if ($ward = $request->get('ward_id')) {
            $query->whereHas('addresses', fn ($addresses) => $addresses->where('ward_id', $ward));
        }
        if ($ageGroup = $request->get('age_group')) {
            match ($ageGroup) {
                'child' => $query->where('date_of_birth', '>', now()->subYears(18)->toDateString()),
                'adult' => $query->whereBetween('date_of_birth', [now()->subYears(60)->toDateString(), now()->subYears(18)->toDateString()]),
                'senior' => $query->where('date_of_birth', '<', now()->subYears(60)->toDateString()),
                default => null,
            };
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
        $citizens = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => CitizenResource::collection($citizens->getCollection())->resolve(),
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
            'appointments' => fn ($query) => $query->latest('requested_date'),
            'interactions',
            'documents.documentCategory',
            'activityLogs' => fn ($query) => $query->with('user:id,name')->latest(),
        ])->findOrFail($id);
        $this->authorize('view', $citizen);

        $villageIds = $citizen->addresses()->whereNotNull('village_id')->pluck('village_id');
        $projects = $villageIds->isEmpty()
            ? collect()
            : \App\Models\Project::with('village:id,name')->whereIn('village_id', $villageIds)
                ->orderByDesc('created_at')->limit(100)->get();

        return response()->json((new CitizenResource($citizen->setAttribute('related_projects', $projects)))->resolve($request));
    }

    public function addresses(Request $request, Citizen $citizen): JsonResponse
    {
        $this->authorize('view', $citizen);
        $query = $citizen->addresses()->with(['village.mandal', 'ward', 'pollingBooth']);
        if ($type = trim((string) $request->get('address_type'))) $query->where('address_type', $type);
        if ($request->filled('is_primary')) $query->where('is_primary', filter_var($request->get('is_primary'), FILTER_VALIDATE_BOOLEAN));
        if ($search = trim((string) $request->get('search'))) {
            $query->where(fn ($q) => $q->where('house_number', 'like', "%{$search}%")
                ->orWhere('street', 'like', "%{$search}%")
                ->orWhere('locality', 'like', "%{$search}%")
                ->orWhere('pincode', 'like', "%{$search}%")
                ->orWhere('district', 'like', "%{$search}%"));
        }
        $results = $query->orderByDesc('is_primary')->latest()->paginate(min(max((int) $request->get('per_page', 20), 1), 100));
        return response()->json(['data' => CitizenAddressResource::collection($results->getCollection())->resolve(), 'meta' => [
            'total' => $results->total(), 'per_page' => $results->perPage(), 'current_page' => $results->currentPage(), 'last_page' => $results->lastPage(),
        ]]);
    }

    public function storeAddress(SaveCitizenAddressRequest $request, Citizen $citizen, CitizenAddressService $service): JsonResponse
    {
        return response()->json((new CitizenAddressResource($service->create($citizen, $request->validated(), $request->user(), $request)))->resolve($request), 201);
    }

    public function updateAddress(SaveCitizenAddressRequest $request, Citizen $citizen, CitizenAddress $address, CitizenAddressService $service): JsonResponse
    {
        abort_unless($address->citizen_id === $citizen->id, 404);
        return response()->json((new CitizenAddressResource($service->update($address, $request->validated(), $request->user(), $request)))->resolve($request));
    }

    public function destroyAddress(Request $request, Citizen $citizen, CitizenAddress $address, CitizenAddressService $service): JsonResponse
    {
        $this->authorize('update', $citizen);
        abort_unless($address->citizen_id === $citizen->id, 404);
        $service->archive($address, $request->user(), $request);
        return response()->json(null, 204);
    }

    public function store(StoreCitizenRequest $request, CitizenEnrollmentService $service): JsonResponse
    {
        return response()->json((new CitizenResource($service->create($request->validated(), $request->user(), $request)))->resolve($request), 201);
    }

    public function update(UpdateCitizenRequest $request, Citizen $citizen, CitizenEnrollmentService $service): JsonResponse
    {
        return response()->json((new CitizenResource($service->update($citizen, $request->validated(), $request->user(), $request)))->resolve($request));
    }

    public function destroy(Request $request, Citizen $citizen): JsonResponse
    {
        $this->authorize('delete', $citizen);
        if ($citizen->userAccount()->exists() || $citizen->familyMembers()->exists()
            || $citizen->grievances()->exists() || $citizen->schemeApplications()->exists()
            || $citizen->schemeBeneficiaries()->exists() || $citizen->surveyResponses()->exists()
            || $citizen->documents()->exists()) {
            return response()->json(['message' => 'Citizens with linked accounts, family membership, cases, benefits, surveys, or documents cannot be archived.'], 409);
        }
        DB::transaction(function () use ($citizen, $request) {
            ActivityLog::create([
                'user_id' => $request->user()->id, 'loggable_type' => Citizen::class, 'loggable_id' => $citizen->id,
                'action' => 'citizen_archived', 'module' => 'citizens', 'description' => 'Citizen record archived',
                'old_values' => $citizen->getAttributes(), 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
            ]);
            $citizen->addresses()->delete();
            $citizen->delete();
        });
        return response()->json(null, 204);
    }

    public function bulkUpdate(BulkUpdateCitizensRequest $request, CitizenEnrollmentService $service): JsonResponse
    {
        $data = $request->validated();
        $fields = collect($data)->except('citizen_ids')->all();
        $updated = 0;
        DB::transaction(function () use ($data, $fields, $request, $service, &$updated): void {
            foreach ($data['citizen_ids'] as $id) {
                $citizen = Citizen::findOrFail($id);
                $this->authorize('update', $citizen);
                $service->update($citizen, $fields, $request->user(), $request);
                $updated++;
            }
        });
        return response()->json(['updated' => $updated]);
    }

    public function bulkArchive(BulkArchiveCitizensRequest $request): JsonResponse
    {
        $archived = 0;
        DB::transaction(function () use ($request, &$archived): void {
            foreach ($request->validated('citizen_ids') as $id) {
                $citizen = Citizen::findOrFail($id);
                $this->authorize('delete', $citizen);
                if ($citizen->userAccount()->exists() || $citizen->familyMembers()->exists()
                    || $citizen->grievances()->exists() || $citizen->schemeApplications()->exists()
                    || $citizen->schemeBeneficiaries()->exists() || $citizen->surveyResponses()->exists()
                    || $citizen->documents()->exists()) {
                    throw ValidationException::withMessages(['citizen_ids' => ["Citizen {$citizen->unique_id} has linked records and cannot be archived."]]);
                }
                ActivityLog::create([
                    'user_id' => $request->user()->id, 'loggable_type' => Citizen::class, 'loggable_id' => $citizen->id,
                    'action' => 'citizen_archived', 'module' => 'citizens', 'description' => 'Citizen record archived in bulk',
                    'old_values' => $citizen->getAttributes(), 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent(),
                ]);
                $citizen->addresses()->delete();
                $citizen->delete();
                $archived++;
            }
        });
        return response()->json(['archived' => $archived]);
    }

    public function import(ImportCitizensRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $path = $file->store('citizen-imports', 'local');
        $batch = CitizenImportBatch::create([
            'created_by' => $request->user()->id,
            'original_filename' => $file->getClientOriginalName(),
            'storage_path' => $path,
            'status' => 'queued',
        ]);
        ProcessCitizenImport::dispatch($batch->id);
        return response()->json($batch, 202);
    }

    public function imports(Request $request): JsonResponse
    {
        $this->authorize('viewAny', CitizenImportBatch::class);
        $query = CitizenImportBatch::query()->latest();
        if (!$request->user()->hasRole('super-admin')) $query->where('created_by', $request->user()->id);
        $results = $query->paginate(min(max((int) $request->get('per_page', 20), 1), 100));
        return response()->json(['data' => $results->items(), 'meta' => [
            'total' => $results->total(), 'per_page' => $results->perPage(),
            'current_page' => $results->currentPage(), 'last_page' => $results->lastPage(),
        ]]);
    }

    public function importShow(Request $request, CitizenImportBatch $batch): JsonResponse
    {
        $this->authorize('view', $batch);
        return response()->json($batch->loadCount([
            'rows as pending_rows' => fn ($q) => $q->where('status', 'pending'),
            'rows as rejected_rows' => fn ($q) => $q->where('status', 'rejected'),
        ]));
    }

    public function importErrors(Request $request, CitizenImportBatch $batch): StreamedResponse
    {
        $this->authorize('view', $batch);
        return response()->streamDownload(function () use ($batch): void {
            $handle = fopen('php://output', 'wb');
            fputcsv($handle, ['Row', 'Status', 'Errors', 'Payload']);
            $batch->rows()->where('status', 'rejected')->orderBy('row_number')->chunk(500, function ($rows) use ($handle): void {
                foreach ($rows as $row) fputcsv($handle, [$row->row_number, $row->status, json_encode($row->errors), json_encode($row->payload)]);
            });
            fclose($handle);
        }, "citizen-import-errors-{$batch->id}.csv", ['Content-Type' => 'text/csv; charset=UTF-8']);
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

    public function exportDirectory(Request $request): StreamedResponse
    {
        $this->authorize('viewAny', Citizen::class);
        $query = Citizen::with(['addresses' => fn ($addresses) => $addresses->where('is_primary', true)->with('village:id,name')]);
        app(GeographicScopeService::class)->apply($query, $request->user());
        if ($search = trim((string) $request->get('search'))) {
            $query->where(fn ($q) => $q->where('first_name', 'ilike', "%{$search}%")
                ->orWhere('last_name', 'ilike', "%{$search}%")
                ->orWhere('mobile_number', 'ilike', "%{$search}%")
                ->orWhere('unique_id', 'ilike', "%{$search}%")
                ->orWhere('voter_id', 'ilike', "%{$search}%"));
        }
        if ($gender = $request->get('gender')) $query->where('gender', $gender);
        if ($request->filled('is_voter')) $query->where('is_voter', filter_var($request->get('is_voter'), FILTER_VALIDATE_BOOLEAN));
        if ($ageGroup = $request->get('age_group')) {
            match ($ageGroup) {
                'child' => $query->where('date_of_birth', '>', now()->subYears(18)->toDateString()),
                'adult' => $query->whereBetween('date_of_birth', [now()->subYears(60)->toDateString(), now()->subYears(18)->toDateString()]),
                'senior' => $query->where('date_of_birth', '<', now()->subYears(60)->toDateString()),
                default => null,
            };
        }
        return response()->streamDownload(function () use ($query): void {
            $handle = fopen('php://output', 'wb');
            fputcsv($handle, ['Citizen ID', 'Name', 'DOB', 'Gender', 'Mobile', 'Voter ID', 'Aadhaar', 'Village', 'Occupation', 'Education']);
            $query->orderBy('id')->chunkById(1000, function ($citizens) use ($handle): void {
                foreach ($citizens as $citizen) {
                    fputcsv($handle, [
                        $citizen->unique_id,
                        trim("{$citizen->first_name} {$citizen->middle_name} {$citizen->last_name}"),
                        $citizen->date_of_birth?->toDateString(),
                        $citizen->gender,
                        $citizen->mobile_number,
                        $citizen->voter_id,
                        $citizen->aadhaar_masked,
                        $citizen->addresses->first()?->village?->name,
                        $citizen->occupation,
                        $citizen->education,
                    ]);
                }
            });
            fclose($handle);
        }, 'citizen-directory-'.now()->format('Y-m-d-His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
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
