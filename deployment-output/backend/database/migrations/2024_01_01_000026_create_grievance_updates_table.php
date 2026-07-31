<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grievance_updates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('grievance_id');
            $table->uuid('updated_by');
            $table->string('update_type');
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('remarks')->nullable();
            $table->boolean('is_internal')->default(false);
            $table->boolean('is_public')->default(true);
            $table->string('attachment')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('grievance_id');
            $table->index('updated_by');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grievance_updates');
    }
};
