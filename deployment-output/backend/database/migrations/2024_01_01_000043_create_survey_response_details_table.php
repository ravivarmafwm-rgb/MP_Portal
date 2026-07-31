<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_response_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('survey_response_id');
            $table->uuid('survey_question_id');
            $table->text('answer')->nullable();
            $table->string('answer_type')->nullable();
            $table->text('attachment')->nullable();
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('survey_response_id');
            $table->index('survey_question_id');
            $table->unique(['survey_response_id', 'survey_question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_response_details');
    }
};
