<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('volunteer_id');
            $table->string('activity_type');
            $table->string('activity_category');
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('activity_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->decimal('hours_spent', 5, 2)->default(0);
            $table->string('location')->nullable();
            $table->uuid('village_id')->nullable();
            $table->uuid('ward_id')->nullable();
            $table->integer('beneficiaries_count')->default(0);
            $table->string('status')->default('completed');
            $table->text('outcome')->nullable();
            $table->text('challenges')->nullable();
            $table->string('photo')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('volunteer_id');
            $table->index('activity_date');
            $table->index('activity_type');
            $table->index('activity_category');
            $table->index('village_id');
            $table->index('ward_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_activities');
    }
};
