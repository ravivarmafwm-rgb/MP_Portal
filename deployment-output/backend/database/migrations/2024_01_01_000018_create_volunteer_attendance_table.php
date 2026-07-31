<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_attendance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('volunteer_id');
            $table->date('attendance_date');
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->string('status')->default('present');
            $table->string('activity_type')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('hours_worked', 5, 2)->default(0);
            $table->string('location')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('volunteer_id');
            $table->index('attendance_date');
            $table->index(['volunteer_id', 'attendance_date']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_attendance');
    }
};
