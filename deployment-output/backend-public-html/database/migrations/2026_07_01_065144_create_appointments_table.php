<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Core identity
            $table->string('appointment_number')->unique();
            $table->string('citizen_name');
            $table->string('citizen_mobile', 15)->nullable();
            $table->string('citizen_email')->nullable();
            $table->string('citizen_village')->nullable();
            $table->string('citizen_mandal')->nullable();

            // Foreign keys (nullable so walk-ins work without a registered citizen)
            $table->foreignUuid('citizen_id')->nullable()->constrained('citizens')->nullOnDelete();
            $table->foreignUuid('constituency_id')->nullable()->constrained('constituencies')->nullOnDelete();
            $table->foreignUuid('assembly_constituency_id')->nullable()->constrained('assembly_constituencies')->nullOnDelete();
            $table->foreignUuid('mandal_id')->nullable()->constrained('mandals')->nullOnDelete();
            $table->foreignUuid('village_id')->nullable()->constrained('villages')->nullOnDelete();

            // Meeting details
            $table->string('purpose');
            $table->text('description')->nullable();
            $table->string('meeting_type')->default('in_person'); // in_person, phone, video
            $table->string('category')->default('general');       // general, grievance, scheme, project, personal
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show'])->default('pending');

            // Schedule
            $table->date('requested_date');
            $table->time('requested_time')->nullable();
            $table->date('scheduled_date')->nullable();
            $table->time('scheduled_time')->nullable();
            $table->integer('duration_minutes')->default(30);
            $table->string('venue')->nullable();

            // Token / queue system
            $table->string('token_number')->nullable();
            $table->integer('queue_position')->nullable();

            // Related entities
            $table->foreignUuid('grievance_id')->nullable()->constrained('grievances')->nullOnDelete();
            $table->foreignUuid('scheme_application_id')->nullable()->constrained('scheme_applications')->nullOnDelete();

            // Assignment
            $table->foreignUuid('assigned_officer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('assigned_officer_name')->nullable();

            // Outcome
            $table->text('meeting_outcome')->nullable();
            $table->text('action_items')->nullable();
            $table->boolean('follow_up_required')->default(false);
            $table->date('follow_up_date')->nullable();
            $table->text('follow_up_notes')->nullable();
            $table->boolean('follow_up_completed')->default(false);

            // Citizen satisfaction
            $table->unsignedTinyInteger('satisfaction_rating')->nullable(); // 1-5
            $table->text('citizen_feedback')->nullable();

            // Meta
            $table->string('created_via')->default('office'); // office, portal, app, phone
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'scheduled_date']);
            $table->index(['citizen_id']);
            $table->index(['village_id']);
            $table->index('requested_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
