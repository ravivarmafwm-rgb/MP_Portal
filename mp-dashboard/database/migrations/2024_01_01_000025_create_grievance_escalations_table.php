<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grievance_escalations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('grievance_id');
            $table->integer('from_level');
            $table->integer('to_level');
            $table->uuid('escalated_by');
            $table->uuid('escalated_to')->nullable();
            $table->string('reason');
            $table->text('description')->nullable();
            $table->date('escalation_date');
            $table->string('status')->default('pending');
            $table->date('acknowledged_date')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('grievance_id');
            $table->index('escalated_by');
            $table->index('escalated_to');
            $table->index('escalation_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grievance_escalations');
    }
};
