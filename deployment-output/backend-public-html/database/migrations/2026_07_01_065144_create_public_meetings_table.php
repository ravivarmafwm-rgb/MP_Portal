<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('public_meetings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('meeting_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('meeting_type', ['town_hall', 'community_meeting', 'department_review', 'stakeholder_meeting', 'awareness_program', 'public_hearing', 'election_campaign', 'other'])->default('town_hall');
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled', 'postponed'])->default('scheduled');

            // Location
            $table->string('venue');
            $table->string('venue_address')->nullable();
            $table->foreignUuid('constituency_id')->nullable()->constrained('constituencies')->nullOnDelete();
            $table->foreignUuid('assembly_constituency_id')->nullable()->constrained('assembly_constituencies')->nullOnDelete();
            $table->foreignUuid('mandal_id')->nullable()->constrained('mandals')->nullOnDelete();
            $table->foreignUuid('village_id')->nullable()->constrained('villages')->nullOnDelete();

            // Schedule
            $table->date('meeting_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->integer('expected_attendance')->default(0);
            $table->integer('actual_attendance')->nullable();

            // Agenda & outcome
            $table->json('agenda_items')->nullable();
            $table->json('topics_discussed')->nullable();
            $table->text('key_outcomes')->nullable();
            $table->text('action_items')->nullable();
            $table->text('media_coverage')->nullable();

            // Organizer
            $table->foreignUuid('organized_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('chief_guest')->nullable();
            $table->json('panelists')->nullable();

            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'meeting_date']);
            $table->index(['village_id']);
            $table->index(['mandal_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('public_meetings');
    }
};
