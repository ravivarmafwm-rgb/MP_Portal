<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_training', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('volunteer_id');
            $table->string('training_name');
            $table->string('training_type');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('venue')->nullable();
            $table->string('trainer')->nullable();
            $table->string('status')->default('completed');
            $table->string('certificate_number')->nullable();
            $table->date('certificate_issue_date')->nullable();
            $table->text('topics_covered')->nullable();
            $table->text('feedback')->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->string('grade')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('volunteer_id');
            $table->index('start_date');
            $table->index('training_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_training');
    }
};
