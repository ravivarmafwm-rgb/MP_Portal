<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Document;
use App\Models\Project;
use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Document::with(['documentCategory', 'createdBy']);

        if ($type = $request->get('documentable_type')) {
            $query->where('documentable_type', $this->resolveModelClass($type));
        }
        if ($id = $request->get('documentable_id')) {
            $query->where('documentable_id', $id);
        }

        $perPage = min((int) $request->get('per_page', 20), 100);
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

    public function upload(Request $request): JsonResponse
    {
        $data = $request->validate([
            'file'               => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx',
            'title'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'documentable_type'  => 'required|in:citizen,volunteer,project',
            'documentable_id'    => 'required|uuid',
            'document_category'  => 'nullable|string|max:100',
        ]);

        $modelClass = $this->resolveModelClass($data['documentable_type']);
        $modelClass::findOrFail($data['documentable_id']);

        $file = $request->file('file');
        $folder = "documents/{$data['documentable_type']}/{$data['documentable_id']}";
        $storedName = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $storedName, 'public');

        $document = Document::create([
            'document_number' => 'DOC' . strtoupper(Str::random(8)),
            'documentable_type' => $modelClass,
            'documentable_id'   => $data['documentable_id'],
            'title'             => $data['title'],
            'description'       => $data['description'] ?? null,
            'file_name'         => $file->getClientOriginalName(),
            'file_path'         => $path,
            'file_size'         => $file->getSize(),
            'file_type'         => $file->getClientOriginalExtension(),
            'mime_type'         => $file->getMimeType(),
            'status'            => 'active',
            'created_by'        => $request->user()->id,
        ]);

        return response()->json($document, 201);
    }

    public function download(string $id): StreamedResponse|JsonResponse
    {
        $document = Document::findOrFail($id);

        if (! Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::disk('public')->download($document->file_path, $document->file_name);
    }

    public function preview(string $id): StreamedResponse|JsonResponse
    {
        $document = Document::findOrFail($id);

        if (! Storage::disk('public')->exists($document->file_path)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::disk('public')->response($document->file_path, $document->file_name, [
            'Content-Type' => $document->mime_type ?? 'application/octet-stream',
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $document = Document::findOrFail($id);

        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->update(['updated_by' => $request->user()->id]);
        $document->delete();

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
