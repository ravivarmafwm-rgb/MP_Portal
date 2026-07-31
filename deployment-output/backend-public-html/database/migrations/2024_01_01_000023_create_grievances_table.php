<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grievances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('grievance_number')->unique();
            $table->uuid('category_id');
            $table->uuid('citizen_id')->nullable();
            $table->string('citizen_name');
            $table->string('citizen_mobile');
            $table->string('citizen_email')->nullable();
            $table->uuid('village_id')->nullable();
            $table->uuid('ward_id')->nullable();
            $table->uuid('polling_booth_id')->nullable();
            $table->string('subject');
            $table->longText('description');
            $table->string('priority')->default('medium');
            $table->string('severity')->default('medium');
            $table->string('status')->default('pending');
            $table->string('source')->default('manual');
            $table->uuid('assigned_to')->nullable();
            $table->uuid('assigned_department_id')->nullable();
            $table->date('due_date')->nullable();
            $table->date('resolved_date')->nullable();
            $table->string('resolution_summary')->nullable();
            $table->integer('escalation_level')->default(0);
            $table->string('satisfaction_rating')->nullable();
            $table->text('citizen_feedback')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->string('location')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('grievance_number');
            $table->index('category_id');
            $table->index('citizen_id');
            $table->index('village_id');
            $table->index('ward_id');
            $table->index('polling_booth_id');
            $table->index('assigned_to');
            $table->index('assigned_department_id');
            $table->index('status');
            $table->index('priority');
            $table->index('due_date');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grievances');
    }
};
