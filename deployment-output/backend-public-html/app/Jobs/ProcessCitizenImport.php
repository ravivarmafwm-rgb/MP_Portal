<?php

namespace App\Jobs;

use App\Models\CitizenImportBatch;
use App\Models\CitizenImportRow;
use App\Models\User;
use App\Services\CitizenEnrollmentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Throwable;

class ProcessCitizenImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 3600;
    public int $tries = 1;

    public function __construct(public string $batchId) {}

    public function handle(CitizenEnrollmentService $service): void
    {
        $batch = CitizenImportBatch::findOrFail($this->batchId);
        $actor = User::findOrFail($batch->created_by);
        $batch->update(['status' => 'processing', 'started_at' => now()]);
        $stream = Storage::disk('local')->readStream($batch->storage_path);
        if (!$stream) throw new \RuntimeException('Citizen import file is unavailable.');

        try {
            $headers = fgetcsv($stream);
            if (!$headers) throw new \RuntimeException('The CSV file has no header row.');
            $headers = array_map(fn ($header) => strtolower(trim((string) $header)), $headers);
            $required = ['first_name', 'last_name', 'date_of_birth', 'gender', 'village_id', 'pincode', 'district', 'state', 'is_voter'];
            $missing = array_values(array_diff($required, $headers));
            if ($missing) throw new \RuntimeException('Missing required CSV columns: '.implode(', ', $missing));

            $rowNumber = 1;
            while (($values = fgetcsv($stream)) !== false) {
                $rowNumber++;
                if (count($values) === 1 && trim((string) $values[0]) === '') continue;
                $payload = [];
                foreach ($headers as $index => $header) $payload[$header] = trim((string) ($values[$index] ?? ''));
                $batch->increment('total_rows');
                $row = CitizenImportRow::create(['batch_id' => $batch->id, 'row_number' => $rowNumber, 'payload' => $payload]);
                $data = $this->normalize($payload);
                $validator = Validator::make($data, [
                    'first_name' => ['required', 'string', 'max:100'],
                    'last_name' => ['required', 'string', 'max:100'],
                    'date_of_birth' => ['required', 'date', 'before_or_equal:today'],
                    'gender' => ['required', 'in:Male,Female,Other'],
                    'mobile_number' => ['nullable', 'regex:/^[6-9][0-9]{9}$/'],
                    'aadhaar_number' => ['nullable', 'regex:/^[0-9]{12}$/'],
                    'voter_id' => ['nullable', 'string', 'max:30'],
                    'is_voter' => ['required', 'boolean'],
                    'village_id' => ['required', 'uuid', 'exists:villages,id'],
                    'pincode' => ['required', 'regex:/^[0-9]{6}$/'],
                    'district' => ['required', 'string', 'max:100'],
                    'state' => ['required', 'string', 'max:100'],
                ]);
                if ($validator->fails()) {
                    $this->reject($batch, $row, $validator->errors()->toArray());
                    continue;
                }
                try {
                    $request = Request::create('/api/citizens', 'POST', $data);
                    $request->setUserResolver(fn () => $actor);
                    $citizen = $service->create($data, $actor, $request, false);
                    $row->update(['status' => 'accepted', 'citizen_id' => $citizen->id]);
                    $batch->increment('accepted_rows');
                } catch (Throwable $exception) {
                    $this->reject($batch, $row, ['row' => [$exception->getMessage()]]);
                }
                $batch->increment('processed_rows');
            }
            $batch->update(['status' => 'completed', 'completed_at' => now()]);
        } catch (Throwable $exception) {
            $batch->update(['status' => 'failed', 'error_message' => $exception->getMessage(), 'completed_at' => now()]);
            throw $exception;
        } finally {
            fclose($stream);
        }
    }

    private function normalize(array $payload): array
    {
        $data = $payload;
        $data['is_voter'] = filter_var($payload['is_voter'] ?? false, FILTER_VALIDATE_BOOLEAN);
        foreach (['mobile_number', 'aadhaar_number', 'voter_id', 'middle_name', 'occupation', 'education'] as $field) {
            if (($data[$field] ?? '') === '') $data[$field] = null;
        }
        return $data;
    }

    private function reject(CitizenImportBatch $batch, CitizenImportRow $row, array $errors): void
    {
        $row->update(['status' => 'rejected', 'errors' => $errors]);
        $batch->increment('rejected_rows');
        $batch->increment('processed_rows');
    }
}
