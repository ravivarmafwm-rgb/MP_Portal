<?php

namespace App\Console\Commands;

use App\Models\Document;
use App\Services\NotificationService;
use Illuminate\Console\Command;

class ProcessDocumentRetention extends Command
{
    protected $signature = 'documents:retention {--dry-run : Report only}';
    protected $description = 'Archive documents whose configured retention period has expired.';

    public function handle(): int
    {
        $query = Document::whereNotNull('retention_until')->whereDate('retention_until', '<', now()->toDateString());
        $count = $query->count();
        if ($this->option('dry-run')) { $this->info("{$count} documents are eligible for retention processing."); return self::SUCCESS; }
        $query->each(function (Document $document): void {
            $document->update(['status' => 'retained']);
            if ($document->createdBy) NotificationService::notifyUser($document->createdBy, 'Document retention processed', "Document {$document->document_number} reached its retention date.", 'documents', null, $document);
        });
        $this->info("Processed {$count} documents.");
        return self::SUCCESS;
    }
}
