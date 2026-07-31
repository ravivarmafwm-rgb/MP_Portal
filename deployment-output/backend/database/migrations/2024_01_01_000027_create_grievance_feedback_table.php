<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grievance_feedback', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('grievance_id');
            $table->foreignUuid('citizen_id')->nullable()->constrained()->nullOnDelete();
            $table->string('feedback_type')->default('resolution');
            $table->integer('rating')->nullable();
            $table->text('comments')->nullable();
            $table->boolean('would_recommend')->nullable();
            $table->date('feedback_date');
            $table->string('feedback_source')->default('portal');
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('grievance_id');
            $table->index('citizen_id');
            $table->index('feedback_date');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grievance_feedback');
    }
};
