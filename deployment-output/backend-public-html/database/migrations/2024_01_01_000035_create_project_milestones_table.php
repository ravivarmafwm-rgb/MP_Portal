<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('target_date');
            $table->date('actual_date')->nullable();
            $table->decimal('target_percentage', 5, 2)->nullable();
            $table->string('status')->default('pending');
            $table->decimal('budget', 18, 2)->nullable();
            $table->decimal('actual_cost', 18, 2)->default(0);
            $table->text('deliverables')->nullable();
            $table->text('remarks')->nullable();
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('project_id');
            $table->index('target_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_milestones');
    }
};
