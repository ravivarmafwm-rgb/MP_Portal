<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('janata_darbar_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('session_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])->default('scheduled');

            // Location
            $table->string('venue');
            $table->foreignUuid('constituency_id')->nullable()->constrained('constituencies')->nullOnDelete();
            $table->foreignUuid('assembly_constituency_id')->nullable()->constrained('assembly_constituencies')->nullOnDelete();
            $table->foreignUuid('mandal_id')->nullable()->constrained('mandals')->nullOnDelete();
            $table->foreignUuid('village_id')->nullable()->constrained('villages')->nullOnDelete();

            // Schedule
            $table->date('session_date');
            $table->time('start_time')->default('09:00:00');
            $table->time('end_time')->nullable();

            // Registration & attendance
            $table->integer('max_registrations')->default(200);
            $table->integer('registered_citizens')->default(0);
            $table->integer('actual_attendance')->default(0);
            $table->integer('token_counter')->default(0);

            // Issues
            $table->integer('issues_raised')->default(0);
            $table->integer('issues_resolved')->default(0);
            $table->integer('issues_referred')->default(0);
            $table->integer('issues_pending')->default(0);

            // Key topics / outcomes
            $table->json('main_topics')->nullable();
            $table->text('key_outcomes')->nullable();
            $table->text('media_coverage')->nullable();

            // Staff
            $table->foreignUuid('presided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('staff_assigned')->nullable();

            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'session_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('janata_darbar_sessions');
    }
};
