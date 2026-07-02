<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->string('document_type');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_size')->nullable();
            $table->string('file_type')->nullable();
            $table->date('document_date')->nullable();
            $table->string('uploaded_by')->nullable();
            $table->boolean('is_public')->default(false);
            $table->string('status')->default('active');
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('project_id');
            $table->index('document_type');
            $table->index('document_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_documents');
    }
};
