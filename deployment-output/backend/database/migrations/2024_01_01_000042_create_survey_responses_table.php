<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_responses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('survey_id');
            $table->uuid('citizen_id')->nullable();
            $table->uuid('volunteer_id')->nullable();
            $table->uuid('village_id')->nullable();
            $table->uuid('ward_id')->nullable();
            $table->string('respondent_name')->nullable();
            $table->string('respondent_mobile')->nullable();
            $table->date('response_date');
            $table->time('response_time')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('status')->default('completed');
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('survey_id');
            $table->index('citizen_id');
            $table->index('volunteer_id');
            $table->index('village_id');
            $table->index('ward_id');
            $table->index('response_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_responses');
    }
};
