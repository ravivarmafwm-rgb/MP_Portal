<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheme_required_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('scheme_id');
            $table->uuid('document_category_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_mandatory')->default(true);
            $table->integer('max_age_days')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('scheme_id')->references('id')->on('schemes')->cascadeOnDelete();
            $table->foreign('document_category_id')->references('id')->on('document_categories')->restrictOnDelete();
            $table->unique(['scheme_id', 'name']);
            $table->index(['scheme_id', 'is_active', 'sort_order']);
        });

        Schema::create('scheme_application_document_reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('application_id');
            $table->uuid('requirement_id');
            $table->uuid('document_id');
            $table->string('status')->default('pending');
            $table->uuid('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('application_id')->references('id')->on('scheme_applications')->cascadeOnDelete();
            $table->foreign('requirement_id')->references('id')->on('scheme_required_documents')->restrictOnDelete();
            $table->foreign('document_id')->references('id')->on('documents')->cascadeOnDelete();
            $table->foreign('reviewed_by')->references('id')->on('users')->nullOnDelete();
            $table->unique(['application_id', 'requirement_id', 'document_id'], 'scheme_document_review_unique');
            $table->index(['application_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheme_application_document_reviews');
        Schema::dropIfExists('scheme_required_documents');
    }
};
