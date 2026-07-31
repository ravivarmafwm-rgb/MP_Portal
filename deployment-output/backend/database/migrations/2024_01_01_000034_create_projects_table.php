<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('project_number')->unique();
            $table->string('name');
            $table->uuid('constituency_id')->nullable();
            $table->uuid('assembly_constituency_id')->nullable();
            $table->uuid('mandal_id')->nullable();
            $table->uuid('village_id')->nullable();
            $table->uuid('ward_id')->nullable();
            $table->uuid('contractor_id')->nullable();
            $table->string('project_type');
            $table->string('category');
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();
            $table->decimal('estimated_cost', 18, 2);
            $table->decimal('sanctioned_amount', 18, 2)->nullable();
            $table->date('sanction_date')->nullable();
            $table->string('sanction_order_number')->nullable();
            $table->date('start_date')->nullable();
            $table->date('scheduled_completion_date')->nullable();
            $table->date('actual_completion_date')->nullable();
            $table->string('status')->default('proposed');
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->decimal('expenditure', 18, 2)->default(0);
            $table->string('location')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('department')->nullable();
            $table->uuid('supervised_by')->nullable();
            $table->text('challenges')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('project_number');
            $table->index('constituency_id');
            $table->index('assembly_constituency_id');
            $table->index('mandal_id');
            $table->index('village_id');
            $table->index('ward_id');
            $table->index('contractor_id');
            $table->index('project_type');
            $table->index('category');
            $table->index('status');
            $table->index('start_date');
            $table->index('scheduled_completion_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
