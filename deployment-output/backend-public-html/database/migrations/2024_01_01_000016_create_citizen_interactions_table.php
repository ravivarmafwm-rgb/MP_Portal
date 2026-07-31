<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citizen_interactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('citizen_id');
            $table->uuid('user_id')->nullable();
            $table->string('interaction_type');
            $table->string('interaction_method')->default('in_person');
            $table->text('subject')->nullable();
            $table->longText('notes')->nullable();
            $table->string('outcome')->nullable();
            $table->date('interaction_date');
            $table->time('interaction_time')->nullable();
            $table->string('follow_up_required')->default('no');
            $table->date('follow_up_date')->nullable();
            $table->text('follow_up_notes')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('citizen_id');
            $table->index('user_id');
            $table->index('interaction_date');
            $table->index('interaction_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citizen_interactions');
    }
};
