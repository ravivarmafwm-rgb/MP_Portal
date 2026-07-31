<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_photos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->uuid('project_update_id')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('thumbnail_path')->nullable();
            $table->string('file_size')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->date('photo_date');
            $table->string('captured_by')->nullable();
            $table->boolean('is_before')->default(false);
            $table->boolean('is_after')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->string('status')->default('active');
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('project_id');
            $table->index('project_update_id');
            $table->index('photo_date');
            $table->index('is_before');
            $table->index('is_after');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_photos');
    }
};
