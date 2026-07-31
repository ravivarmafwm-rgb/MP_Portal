<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Document;
use App\Models\SchemeApplication;
use App\Models\SchemeApplicationDocumentReview;
use App\Models\SchemeRequiredDocument;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SchemeDocumentService
{
    public function upload(
        SchemeApplication $application,
        SchemeRequiredDocument $requirement,
        UploadedFile $file,
        array $data,
        User $actor,
        ?string $ip,
        ?string $agent
    ): SchemeApplicationDocumentReview {
        abort_unless($requirement->scheme_id === $application->scheme_id && $requirement->is_active, 422, 'This requirement is not active for the selected scheme.');
        abort_unless(in_array($application->status, ['submitted', 'under_review'], true), 422, 'Documents cannot be uploaded in the current application state.');
        $path = $file->storeAs(
            "documents/scheme-application/{$application->id}",
            Str::uuid().'.'.$file->getClientOriginalExtension(),
            'local'
        );
        abort_unless($path, 500, 'The document could not be stored.');

        try {
            return DB::transaction(function () use ($application, $requirement, $file, $path, $data, $actor, $ip, $agent) {
                $document = Document::create([
                    'document_number' => 'DOC'.strtoupper(Str::random(8)),
                    'document_category_id' => $requirement->document_category_id,
                    'documentable_type' => SchemeApplication::class,
                    'documentable_id' => $application->id,
                    'title' => $requirement->name,
                    'description' => $data['description'] ?? null,
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path, 'storage_disk' => 'local',
                    'checksum_sha256' => hash_file('sha256', $file->getRealPath()),
                    'file_size' => $file->getSize(), 'file_type' => $file->getClientOriginalExtension(),
                    'mime_type' => $file->getMimeType(), 'status' => 'active',
                    'document_date' => $data['document_date'], 'is_confidential' => true,
                    'is_verified' => false, 'created_by' => $actor->id,
                ]);
                $document->versions()->create([
                    'version_number' => 1, 'file_name' => $document->file_name,
                    'file_path' => $path, 'file_size' => $document->file_size,
                    'file_type' => $document->file_type, 'mime_type' => $document->mime_type,
                    'storage_disk' => 'local', 'checksum_sha256' => $document->checksum_sha256,
                    'change_notes' => 'Initial application document',
                    'uploaded_by' => $actor->id, 'is_current' => true, 'created_by' => $actor->id,
                ]);
                $review = SchemeApplicationDocumentReview::create([
                    'application_id' => $application->id, 'requirement_id' => $requirement->id,
                    'document_id' => $document->id, 'status' => 'pending', 'created_by' => $actor->id,
                ]);
                $this->audit($application, $actor, 'application_document_uploaded', [
                    'requirement_id' => $requirement->id, 'document_id' => $document->id,
                ], $ip, $agent);
                return $review->load(['requirement.documentCategory', 'document.documentCategory']);
            });
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($path);
            throw $exception;
        }
    }

    public function review(
        SchemeApplicationDocumentReview $review,
        array $data,
        User $actor,
        ?string $ip,
        ?string $agent
    ): SchemeApplicationDocumentReview {
        return DB::transaction(function () use ($review, $data, $actor, $ip, $agent) {
            $locked = SchemeApplicationDocumentReview::query()
                ->with(['application', 'requirement', 'document'])->lockForUpdate()->findOrFail($review->id);
            abort_unless($locked->status === 'pending', 422, 'Only pending documents can be reviewed.');
            $status = $data['action'] === 'verify' ? 'verified' : 'rejected';
            if ($status === 'verified' && $locked->requirement->max_age_days) {
                abort_unless(
                    $locked->document->document_date?->gte(today()->subDays($locked->requirement->max_age_days)),
                    422,
                    'The document is older than this requirement allows.'
                );
            }
            $locked->update([
                'status' => $status, 'reviewed_by' => $actor->id, 'reviewed_at' => now(),
                'rejection_reason' => $status === 'rejected' ? $data['rejection_reason'] : null,
                'updated_by' => $actor->id,
            ]);
            $locked->document->update([
                'is_verified' => $status === 'verified', 'verified_by' => $actor->id,
                'verified_date' => today(), 'remarks' => $data['rejection_reason'] ?? null,
                'updated_by' => $actor->id,
            ]);
            $this->audit($locked->application, $actor, "application_document_{$status}", [
                'requirement_id' => $locked->requirement_id, 'document_id' => $locked->document_id,
            ], $ip, $agent);
            if ($citizen = User::where('citizen_id', $locked->application->citizen_id)->first()) {
                NotificationService::notifyUser(
                    $citizen, 'Scheme Document Reviewed',
                    "{$locked->requirement->name} was {$status}.",
                    'scheme', '/citizen', $locked->application,
                    $status === 'rejected' ? 'high' : 'normal'
                );
            }
            return $locked->fresh(['requirement.documentCategory', 'document.documentCategory', 'reviewedBy:id,name']);
        });
    }

    private function audit(SchemeApplication $application, User $actor, string $action, array $values, ?string $ip, ?string $agent): void
    {
        ActivityLog::create([
            'user_id' => $actor->id, 'loggable_type' => SchemeApplication::class,
            'loggable_id' => $application->id, 'action' => $action, 'module' => 'schemes',
            'description' => str_replace('_', ' ', ucfirst($action)).'.',
            'new_values' => $values, 'ip_address' => $ip, 'user_agent' => $agent,
        ]);
    }
}
