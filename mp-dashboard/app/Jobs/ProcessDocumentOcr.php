<?php

namespace App\Jobs;

use App\Models\Document;
use App\Services\DocumentOcrService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Batchable;

class ProcessDocumentOcr implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable;

    public int $tries = 3;
    public array $backoff = [30, 120, 600];

    public function __construct(public string $documentId) {}

    public function handle(DocumentOcrService $ocr): void
    {
        $document = Document::find($this->documentId);
        if ($document) $ocr->process($document);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Document OCR failed', ['document_id' => $this->documentId, 'error' => $exception->getMessage()]);
    }
}
