<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_performance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('volunteer_id');
            $table->string('evaluation_period');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_activities')->default(0);
            $table->decimal('total_hours', 8, 2)->default(0);
            $table->integer('beneficiaries_served')->default(0);
            $table->decimal('attendance_rate', 5, 2)->default(0);
            $table->decimal('task_completion_rate', 5, 2)->default(0);
            $table->decimal('quality_score', 5, 2)->default(0);
            $table->decimal('leadership_score', 5, 2)->default(0);
            $table->decimal('teamwork_score', 5, 2)->default(0);
            $table->decimal('overall_score', 5, 2)->default(0);
            $table->string('rating')->default('C');
            $table->text('strengths')->nullable();
            $table->text('areas_for_improvement')->nullable();
            $table->text('feedback')->nullable();
            $table->uuid('evaluated_by')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('volunteer_id');
            $table->index('evaluation_period');
            $table->index('overall_score');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_performance');
    }
};
