<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mp_tours', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tour_number')->unique();
            $table->string('title');
            $table->text('objectives')->nullable();
            $table->enum('tour_type', ['constituency_visit', 'inspection', 'public_meeting_tour', 'scheme_review', 'project_inspection', 'election_campaign', 'field_survey', 'other'])->default('constituency_visit');
            $table->enum('status', ['planned', 'ongoing', 'completed', 'cancelled', 'postponed'])->default('planned');

            // Schedule
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->time('departure_time')->nullable();

            // Coverage
            $table->foreignUuid('constituency_id')->nullable()->constrained('constituencies')->nullOnDelete();
            $table->json('assembly_constituencies_covered')->nullable();
            $table->json('mandals_covered')->nullable();
            $table->json('villages_covered')->nullable();
            $table->integer('villages_count')->default(0);
            $table->integer('citizens_met')->default(0);

            // Outcome
            $table->text('key_outcomes')->nullable();
            $table->text('issues_noted')->nullable();
            $table->text('commitments_made')->nullable();
            $table->text('follow_up_actions')->nullable();
            $table->json('media_coverage')->nullable();

            // Team
            $table->foreignUuid('led_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('team_members')->nullable();

            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'start_date']);
            $table->index('constituency_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mp_tours');
    }
};
