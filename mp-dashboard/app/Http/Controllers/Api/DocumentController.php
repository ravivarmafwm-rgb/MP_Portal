<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\DocumentVersion;
use App\Models\Project;
use App\Models\Volunteer;
use App\Models\Grievance;
use App\Models\SchemeApplication;
use App\Models\PublicMeeting;
use App\Models\Appointment;
use App\Models\ActivityLog;
use App\Http\Requests\Document\UploadDocumentRequest;
use App\Http\Requests\Document\UploadDocumentVersionRequest;
use App\Services\GeographicScopeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Services\UploadSecurityService;
use App\Jobs\ProcessDocumentOcr;

class DocumentController extends Controller
{
    public function categories(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Document::class);
        return response()->json(
            DocumentCategory::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug'])
                ->map(fn (DocumentCategory $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'code' => $category->slug,
                ])
        );
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Document::class);
        $query = Document::with(['documentCategory', 'createdBy']);
        $user = $request->user();
        if (!$user->hasRole(['super-admin', 'mp'])) {
            $query->where(function ($documents) use ($user) {
                $documents->where('created_by', $user->id)
                    ->orWhereHasMorph(
                        'documentable',
                        [Citizen::class, Volunteer::class, Project::class, Grievance::class, SchemeApplication::class],
                        fn ($owners) => app(GeographicScopeService::class)->apply($owners, $user)
                    );
            });
        }

        if ($type = $request->get('documentable_type')) {
            $query->where('documentable_type', $this->resolveModelClass($type));
        }
        if ($id = $request->get('documentable_id')) {
            $query->where('documentable_id', $id);
        }
        if ($search = trim((string) $request->get('search'))) {
            $query->where(fn ($documents) => $documents->where('title', 'ilike', "%{$search}%")
                ->orWhere('file_name', 'ilike', "%{$search}%")
                ->orWhere('document_number', 'ilike', "%{$search}%"));
        }
        if ($status = $request->get('status')) $query->where('status', $status);
        if ($category = $request->get('document_category_id')) $query->where('document_category_id', $category);

        $perPage = min(max((int) $request->get('per_page', 20), 1), 100);
        $results = $query->orderByDesc('created_at')->paginate($perPage);

        return response()->json([
            'data' => $results->items(),
            'meta' => [
                'total'        => $results->total(),
                'per_page'     => $results->perPage(),
                'current_page' => $results->currentPage(),
                'last_page'    => $results->lastPage(),
            ],
        ]);
    }

    public function upload(UploadDocumentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $modelClass = $this->resolveModelClass($data['documentable_type']);
        $owner = $modelClass::findOrFail($data['documentable_id']);
        $this->authorize('create', [Document::class, $owner]);

        $file = $request->file('file');
        app(UploadSecurityService::class)->validate($file);
        $folder = "documents/{$data['documentable_type']}/{$data['documentable_id']}";
        $storedName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $storedName, 'local');
        abort_unless($path, 500, 'The document could not be stored.');

        try {
            $document = DB::transaction(function () use ($data, $request, $file, $path, $modelClass) {
                $document = Document::create([
            'document_number' => 'DOC' . strtoupper(Str::random(8)),
            'document_category_id' => $data['document_category_id'],
            'documentable_type' => $modelClass,
            'documentable_id'   => $data['documentable_id'],
            'title'             => $data['title'],
            'description'       => $data['description'] ?? null,
            'file_name'         => $file->getClientOriginalName(),
            'file_path'         => $path,
            'storage_disk'      => 'local',
            'checksum_sha256'   => hash_file('sha256', $file->getRealPath()),
            'file_size'         => $file->getSize(),
            'file_type'         => $file->getClientOriginalExtension(),
            'mime_type'         => $file->getMimeType(),
            'status'            => 'active',
            'document_date'     => $data['document_date'] ?? null,
            'expiry_date'       => $data['expiry_date'] ?? null,
            'is_confidential'   => $data['is_confidential'] ?? false,
            'created_by'        => $request->user()->id,
                ]);
                $document->versions()->create([
                    'version_number' => 1,
                    'file_name' => $document->file_name,
                    'file_path' => $document->file_path,
                    'file_size' => $document->file_size,
                    'file_type' => $document->file_type,
                    'mime_type' => $document->mime_type,
                    'storage_disk' => $document->storage_disk,
                    'checksum_sha256' => $document->checksum_sha256,
                    'change_notes' => 'Initial version',
                    'uploaded_by' => $request->user()->id,
                    'is_current' => true,
                    'created_by' => $request->user()->id,
                ]);
                ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Document::class, 'loggable_id' => $document->id, 'action' => 'uploaded', 'module' => 'documents', 'description' => 'Document uploaded', 'new_values' => ['title' => $document->title, 'documentable_type' => $data['documentable_type']], 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
                return $document;
            });
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($path);
            throw $exception;
        }

        if ($request->boolean('request_ocr') && in_array($document->mime_type, ['application/pdf', 'image/jpeg', 'image/png'], true)) {
            $document->update(['ocr_status' => 'queued']);
            ProcessDocumentOcr::dispatch($document->id)->onQueue('documents');
        }
        return response()->json($document->fresh(), 201);
    }

    public function versions(Request $request, string $id): JsonResponse
    {
        $document = Document::findOrFail($id);
        $this->authorize('view', $document);

        return response()->json([
            'data' => $document->versions()
                ->with('uploadedBy:id,name')
                ->orderByDesc('version_number')
                ->get(),
        ]);
    }

    public function uploadVersion(UploadDocumentVersionRequest $request, string $id): JsonResponse
    {
        $document = Document::findOrFail($id);
        $this->authorize('update', $document);
        $file = $request->file('file');
        app(UploadSecurityService::class)->validate($file);
        $folder = "documents/versions/{$document->id}";
        $path = $file->storeAs($folder, Str::uuid().'.'.$file->getClientOriginalExtension(), 'local');
        abort_unless($path, 500, 'The document version could not be stored.');

        try {
            $version = DB::transaction(function () use ($document, $request, $file, $path) {
                $locked = Document::query()->lockForUpdate()->findOrFail($document->id);
                if (!$locked->versions()->withTrashed()->exists()) {
                    $locked->versions()->create([
                        'version_number' => 1,
                        'file_name' => $locked->file_name,
                        'file_path' => $locked->file_path,
                        'file_size' => $locked->file_size,
                        'file_type' => $locked->file_type,
                        'mime_type' => $locked->mime_type,
                        'storage_disk' => $locked->storage_disk ?: 'local',
                        'checksum_sha256' => $locked->checksum_sha256,
                        'change_notes' => 'Initial version imported from the existing document',
                        'uploaded_by' => $locked->created_by ?: $request->user()->id,
                        'is_current' => true,
                        'created_by' => $locked->created_by ?: $request->user()->id,
                    ]);
                }
                $next = ((int) $locked->versions()->withTrashed()->max('version_number')) + 1;
                $checksum = hash_file('sha256', $file->getRealPath());
                $locked->versions()->update(['is_current' => false, 'updated_by' => $request->user()->id]);
                $version = $locked->versions()->create([
                    'version_number' => $next,
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getClientOriginalExtension(),
                    'mime_type' => $file->getMimeType(),
                    'storage_disk' => 'local',
                    'checksum_sha256' => $checksum,
                    'change_notes' => $request->validated('change_notes'),
                    'uploaded_by' => $request->user()->id,
                    'is_current' => true,
                    'created_by' => $request->user()->id,
                ]);
                $locked->update([
                    'file_name' => $version->file_name,
                    'file_path' => $version->file_path,
                    'file_size' => $version->file_size,
                    'file_type' => $version->file_type,
                    'mime_type' => $version->mime_type,
                    'storage_disk' => $version->storage_disk,
                    'checksum_sha256' => $version->checksum_sha256,
                    'updated_by' => $request->user()->id,
                ]);
                ActivityLog::create([
                    'user_id' => $request->user()->id,
                    'loggable_type' => Document::class,
                    'loggable_id' => $locked->id,
                    'action' => 'version_uploaded',
                    'module' => 'documents',
                    'description' => "Document version {$next} uploaded",
                    'new_values' => ['version_number' => $next, 'change_notes' => $version->change_notes],
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
                return $version->load('uploadedBy:id,name');
            });
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($path);
            throw $exception;
        }

        return response()->json($version, 201);
    }

    public function downloadVersion(Request $request, string $id, string $versionId): StreamedResponse|JsonResponse
    {
        $document = Document::findOrFail($id);
        $this->authorize('view', $document);
        $version = $document->versions()->findOrFail($versionId);
        $disk = $version->storage_disk ?: 'local';
        if (!Storage::disk($disk)->exists($version->file_path)) {
            return response()->json(['message' => 'Version file not found.'], 404);
        }
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'loggable_type' => Document::class,
            'loggable_id' => $document->id,
            'action' => 'version_downloaded',
            'module' => 'documents',
            'description' => "Document version {$version->version_number} downloaded",
            'new_values' => ['version_number' => $version->version_number],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return Storage::disk($disk)->download($version->file_path, $version->file_name);
    }

    public function download(Request $request, string $id): StreamedResponse|JsonResponse
    {
        $document = Document::findOrFail($id);
        $this->authorize('view', $document);
        $disk = $document->storage_disk ?: 'public';

        if (! Storage::disk($disk)->exists($document->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Document::class, 'loggable_id' => $document->id, 'action' => 'downloaded', 'module' => 'documents', 'description' => 'Document downloaded', 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
        return Storage::disk($disk)->download($document->file_path, $document->file_name);
    }

    public function preview(Request $request, string $id): StreamedResponse|JsonResponse
    {
        $document = Document::findOrFail($id);
        $this->authorize('view', $document);
        $disk = $document->storage_disk ?: 'public';

        if (! Storage::disk($disk)->exists($document->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Document::class, 'loggable_id' => $document->id, 'action' => 'previewed', 'module' => 'documents', 'description' => 'Document previewed', 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
        return Storage::disk($disk)->response($document->file_path, $document->file_name, [
            'Content-Type' => $document->mime_type ?? 'application/octet-stream',
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $document = Document::findOrFail($id);
        $this->authorize('delete', $document);
        $document->update(['updated_by' => $request->user()->id]);
        $document->delete();
        ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Document::class, 'loggable_id' => $document->id, 'action' => 'archived', 'module' => 'documents', 'description' => 'Document archived; retained files were not physically destroyed', 'old_values' => ['title' => $document->title], 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);

        return response()->json(['message' => 'Document archived successfully.']);
    }

    public function search(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Document::class);
        $term = trim((string) $request->get('q', ''));
        abort_if(mb_strlen($term) < 2, 422, 'Search text must contain at least two characters.');
        $query = Document::query()->where(function ($documents) use ($term): void {
            $documents->where('title', 'ilike', "%{$term}%")
                ->orWhere('document_number', 'ilike', "%{$term}%")
                ->orWhere('file_name', 'ilike', "%{$term}%")
                ->orWhere('ocr_text', 'ilike', "%{$term}%");
        });
        return response()->json($query->orderByDesc('created_at')->paginate(min(max($request->integer('per_page', 20), 1), 100)));
    }

    private function resolveModelClass(string $type): string
    {
        return match ($type) {
            'citizen'   => Citizen::class,
            'volunteer' => Volunteer::class,
            'project'   => Project::class,
            'grievance' => Grievance::class,
            'scheme_application' => SchemeApplication::class,
            'public_meeting' => PublicMeeting::class,
            'appointment' => Appointment::class,
            default     => throw new \InvalidArgumentException('Invalid documentable type'),
        };
    }
}
