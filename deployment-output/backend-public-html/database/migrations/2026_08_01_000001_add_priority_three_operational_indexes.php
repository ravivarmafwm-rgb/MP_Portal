<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $indexes = [
            'citizens' => [
                ['first_name', 'last_name'], ['mobile_number'], ['voter_id'],
            ],
            'grievances' => [
                ['status', 'priority'], ['due_date'], ['assigned_department_id'],
            ],
            'projects' => [
                ['status'], ['category'], ['project_type'],
            ],
            'surveys' => [
                ['status', 'start_date'],
            ],
            'documents' => [
                ['status', 'expiry_date'], ['documentable_type', 'documentable_id'],
            ],
            'appointments' => [
                ['status', 'scheduled_date'], ['follow_up_required', 'follow_up_completed', 'follow_up_date'],
            ],
            'public_meetings' => [
                ['status', 'meeting_date'],
            ],
            'communication_recipients' => [
                ['status', 'queued_at'], ['status', 'attempts'],
            ],
        ];

        foreach ($indexes as $table => $columns) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            foreach ($columns as $columnSet) {
                $originalCount = count($columnSet);
                $columnSet = array_values(array_filter($columnSet, fn (string $column): bool => Schema::hasColumn($table, $column)));
                if ($columnSet === [] || count($columnSet) !== $originalCount) continue;
                $name = 'p3_'.substr($table.'_'.implode('_', $columnSet), 0, 55);
                if (! Schema::hasIndex($table, $name)) {
                    Schema::table($table, function (Blueprint $blueprint) use ($columnSet, $name): void {
                        $blueprint->index($columnSet, $name);
                    });
                }
            }
        }

        Schema::table('documents', function (Blueprint $table): void {
            if (! Schema::hasColumn('documents', 'ocr_status')) $table->string('ocr_status')->default('not_requested')->index();
            if (! Schema::hasColumn('documents', 'ocr_text')) $table->text('ocr_text')->nullable();
            if (! Schema::hasColumn('documents', 'ocr_error')) $table->text('ocr_error')->nullable();
            if (! Schema::hasColumn('documents', 'ocr_processed_at')) $table->timestampTz('ocr_processed_at')->nullable();
            if (! Schema::hasColumn('documents', 'retention_until')) $table->date('retention_until')->nullable()->index();
        });
    }

    public function down(): void
    {
        $indexes = [
            'citizens' => [['first_name', 'last_name'], ['mobile_number'], ['voter_id']],
            'grievances' => [['status', 'priority'], ['due_date'], ['assigned_department_id']],
            'projects' => [['status'], ['category'], ['project_type']],
            'surveys' => [['status', 'start_date']],
            'documents' => [['status', 'expiry_date'], ['documentable_type', 'documentable_id']],
            'appointments' => [['status', 'scheduled_date'], ['follow_up_required', 'follow_up_completed', 'follow_up_date']],
            'public_meetings' => [['status', 'meeting_date']],
            'communication_recipients' => [['status', 'queued_at'], ['status', 'attempts']],
        ];
        foreach ($indexes as $table => $columnSets) {
            if (! Schema::hasTable($table)) continue;
            foreach ($columnSets as $columnSet) {
                $name = 'p3_'.substr($table.'_'.implode('_', $columnSet), 0, 55);
                if (Schema::hasIndex($table, $name)) Schema::table($table, fn (Blueprint $blueprint) => $blueprint->dropIndex($name));
            }
        }
        if (Schema::hasTable('documents')) {
            Schema::table('documents', function (Blueprint $table): void {
                foreach (['ocr_status','ocr_text','ocr_error','ocr_processed_at','retention_until'] as $column) {
                    if (Schema::hasColumn('documents', $column)) $table->dropColumn($column);
                }
            });
        }
    }
};
