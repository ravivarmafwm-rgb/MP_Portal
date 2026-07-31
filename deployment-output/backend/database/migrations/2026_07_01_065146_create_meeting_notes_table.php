<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Polymorphic: appointment, public_meeting, janata_darbar_session, mp_tour
            $table->string('notable_type');
            $table->uuid('notable_id');

            $table->string('title')->nullable();
            $table->text('content');
            $table->enum('note_type', ['discussion', 'action_item', 'commitment', 'follow_up', 'general'])->default('general');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->boolean('is_private')->default(false);
            $table->boolean('is_completed')->default(false);
            $table->date('due_date')->nullable();
            $table->date('completed_date')->nullable();
            $table->string('assigned_to_name')->nullable();
            $table->foreignUuid('assigned_to')->nullable()->constrained('users')->nullOnDelete();

            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['notable_type', 'notable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_notes');
    }
};
