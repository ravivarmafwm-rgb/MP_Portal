<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\Project;
use App\Models\Volunteer;
use App\Models\ActivityLog;
use App\Http\Requests\Document\UploadDocumentRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function categories(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Document::class);
        return response()->json(DocumentCategory::query()->where('is_active', true)->orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'code']));
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Document::class);
        $query = Document::with(['documentCategory', 'createdBy']);
        $user = $request->user();
        if ($user->village_id || $user->ward_id) {
            $query->where(function ($documents) use ($user) {
                $documents->where('created_by', $user->id)
                    ->orWhereHasMorph('documentable', [Citizen::class], fn ($citizens) => $citizens->whereHas('addresses', fn ($addresses) => $addresses->where($user->ward_id ? 'ward_id' : 'village_id', $user->ward_id ?: $user->village_id)))
                    ->orWhereHasMorph('documentable', [Volunteer::class], fn ($volunteers) => $volunteers->where($user->ward_id ? 'ward_id' : 'village_id', $user->ward_id ?: $user->village_id))
                    ->orWhereHasMorph('documentable', [Project::class], fn ($projects) => $projects->where($user->ward_id ? 'ward_id' : 'village_id', $user->ward_id ?: $user->village_id));
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
                ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Document::class, 'loggable_id' => $document->id, 'action' => 'uploaded', 'module' => 'documents', 'description' => 'Document uploaded', 'new_values' => ['title' => $document->title, 'documentable_type' => $data['documentable_type']], 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);
                return $document;
            });
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($path);
            throw $exception;
        }

        return response()->json($document, 201);
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
        $disk = $document->storage_disk ?: 'public';

        if (Storage::disk($disk)->exists($document->file_path)) {
            Storage::disk($disk)->delete($document->file_path);
        }

        $document->update(['updated_by' => $request->user()->id]);
        $document->delete();
        ActivityLog::create(['user_id' => $request->user()->id, 'loggable_type' => Document::class, 'loggable_id' => $document->id, 'action' => 'deleted', 'module' => 'documents', 'description' => 'Document deleted', 'old_values' => ['title' => $document->title], 'ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]);

        return response()->json(['message' => 'Document deleted successfully.']);
    }

    private function resolveModelClass(string $type): string
    {
        return match ($type) {
            'citizen'   => Citizen::class,
            'volunteer' => Volunteer::class,
            'project'   => Project::class,
            default     => throw new \InvalidArgumentException('Invalid documentable type'),
        };
    }
}
