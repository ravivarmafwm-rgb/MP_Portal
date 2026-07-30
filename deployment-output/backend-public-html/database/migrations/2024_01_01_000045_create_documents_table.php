<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('document_number')->unique();
            $table->uuid('document_category_id');
            $table->string('documentable_type')->nullable();
            $table->uuid('documentable_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_size')->nullable();
            $table->string('file_type')->nullable();
            $table->string('mime_type')->nullable();
            $table->date('document_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('status')->default('active');
            $table->boolean('is_confidential')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->uuid('verified_by')->nullable();
            $table->date('verified_date')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('document_number');
            $table->index('document_category_id');
            $table->index(['documentable_type', 'documentable_id']);
            $table->index('document_date');
            $table->index('expiry_date');
            $table->index('status');
            $table->index('is_verified');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
