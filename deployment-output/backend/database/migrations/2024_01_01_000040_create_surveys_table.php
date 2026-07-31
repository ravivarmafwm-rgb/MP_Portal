<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surveys', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('survey_code')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category');
            $table->uuid('constituency_id')->nullable();
            $table->uuid('assembly_constituency_id')->nullable();
            $table->uuid('mandal_id')->nullable();
            $table->uuid('village_id')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('status')->default('draft');
            $table->uuid('created_by');
            $table->uuid('supervised_by')->nullable();
            $table->integer('target_responses')->nullable();
            $table->integer('total_responses')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('require_authentication')->default(false);
            $table->text('instructions')->nullable();
            $table->string('language')->default('en');
            $table->softDeletes();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('survey_code');
            $table->index('category');
            $table->index('constituency_id');
            $table->index('assembly_constituency_id');
            $table->index('mandal_id');
            $table->index('village_id');
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surveys');
    }
};
