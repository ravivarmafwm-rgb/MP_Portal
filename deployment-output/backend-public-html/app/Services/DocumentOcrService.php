<?php

namespace App\Services;

use App\Models\Document;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class DocumentOcrService
{
    public function process(Document $document): void
    {
        $endpoint = (string) config('services.ocr.endpoint');
        $token = (string) config('services.ocr.token');
        if ($endpoint === '' || $token === '') {
            throw new RuntimeException('OCR provider is not configured.');
        }

        $disk = Storage::disk($document->storage_disk ?: 'local');
        if (! $disk->exists($document->file_path)) {
            throw new RuntimeException('The source document is no longer available.');
        }
        $document->update(['ocr_status' => 'processing', 'ocr_error' => null]);
        try {
            $stream = fopen($disk->path($document->file_path), 'rb');
            if ($stream === false) throw new RuntimeException('The source document could not be opened.');
            $response = Http::withToken($token)->timeout((int) config('services.ocr.timeout', 60))
                ->attach('file', $stream, $document->file_name)
                ->post($endpoint, ['document_id' => $document->id]);
            fclose($stream);
            if (! $response->successful()) throw new RuntimeException('OCR provider returned HTTP '.$response->status().'.');
            $text = (string) data_get($response->json(), 'text', '');
            $document->update(['ocr_status' => 'completed', 'ocr_text' => $text, 'ocr_processed_at' => now(), 'ocr_error' => null]);
        } catch (\Throwable $exception) {
            $document->update(['ocr_status' => 'failed', 'ocr_error' => mb_substr($exception->getMessage(), 0, 2000)]);
            throw $exception;
        }
    }
}
