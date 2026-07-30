<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grievance_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('grievance_id');
            $table->uuid('assigned_to');
            $table->uuid('assigned_by');
            $table->uuid('department_id')->nullable();
            $table->string('assignment_type')->default('primary');
            $table->text('instructions')->nullable();
            $table->date('assigned_date');
            $table->date('due_date')->nullable();
            $table->string('status')->default('assigned');
            $table->date('accepted_date')->nullable();
            $table->date('rejected_date')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('grievance_id');
            $table->index('assigned_to');
            $table->index('assigned_by');
            $table->index('department_id');
            $table->index('status');
            $table->index('assigned_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grievance_assignments');
    }
};
