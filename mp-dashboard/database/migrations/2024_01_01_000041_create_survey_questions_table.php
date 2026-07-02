<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('survey_id');
            $table->text('question_text');
            $table->string('question_type');
            $table->text('options')->nullable();
            $table->boolean('is_required')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('validation_rule')->nullable();
            $table->text('help_text')->nullable();
            $table->string('category')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('survey_id');
            $table->index('sort_order');
            $table->index('question_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_questions');
    }
};
