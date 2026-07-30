<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_updates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->uuid('updated_by');
            $table->decimal('progress_percentage', 5, 2)->default(0);
            $table->decimal('expenditure', 18, 2)->default(0);
            $table->text('work_done')->nullable();
            $table->text('challenges')->nullable();
            $table->text('next_steps')->nullable();
            $table->string('weather_condition')->nullable();
            $table->integer('labour_count')->nullable();
            $table->integer('machinery_count')->nullable();
            $table->string('photo')->nullable();
            $table->string('video')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->date('update_date');
            $table->boolean('is_verified')->default(false);
            $table->uuid('verified_by')->nullable();
            $table->date('verified_date')->nullable();
            $table->text('verification_notes')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by_user')->nullable();
            $table->timestamps();

            $table->index('project_id');
            $table->index('updated_by');
            $table->index('update_date');
            $table->index('is_verified');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_updates');
    }
};
