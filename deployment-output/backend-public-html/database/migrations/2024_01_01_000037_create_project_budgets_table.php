<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_budgets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('budget_head');
            $table->text('description')->nullable();
            $table->decimal('allocated_amount', 18, 2);
            $table->decimal('revised_amount', 18, 2)->nullable();
            $table->decimal('utilized_amount', 18, 2)->default(0);
            $table->decimal('balance_amount', 18, 2)->default(0);
            $table->string('status')->default('active');
            $table->date('allocation_date')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('project_id');
            $table->index('budget_head');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_budgets');
    }
};
