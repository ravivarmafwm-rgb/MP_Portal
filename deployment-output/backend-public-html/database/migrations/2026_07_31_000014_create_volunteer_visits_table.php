<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('volunteer_visits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('volunteer_id');
            $table->uuid('citizen_id')->nullable();
            $table->uuid('family_id')->nullable();
            $table->uuid('village_id')->nullable();
            $table->uuid('ward_id')->nullable();
            $table->string('visit_type')->default('citizen');
            $table->string('status')->default('assigned');
            $table->timestampTz('scheduled_at')->nullable();
            $table->timestampTz('checked_in_at')->nullable();
            $table->timestampTz('checked_out_at')->nullable();
            $table->decimal('check_in_latitude', 10, 8)->nullable();
            $table->decimal('check_in_longitude', 11, 8)->nullable();
            $table->decimal('check_out_latitude', 10, 8)->nullable();
            $table->decimal('check_out_longitude', 11, 8)->nullable();
            $table->text('notes')->nullable();
            $table->text('outcome')->nullable();
            $table->boolean('follow_up_required')->default(false);
            $table->date('follow_up_date')->nullable();
            $table->text('follow_up_notes')->nullable();
            $table->jsonb('attachments')->nullable();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index(['volunteer_id', 'status']);
            $table->index(['citizen_id', 'scheduled_at']);
            $table->index(['family_id', 'scheduled_at']);
            $table->index(['village_id', 'status']);
        });
    }
    public function down(): void { Schema::dropIfExists('volunteer_visits'); }
};
