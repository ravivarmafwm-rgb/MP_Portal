<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id')->nullable();
            $table->uuid('citizen_id')->nullable();
            $table->string('volunteer_id')->unique();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('father_name')->nullable();
            $table->date('date_of_birth');
            $table->string('gender');
            $table->string('mobile_number');
            $table->string('alternate_mobile')->nullable();
            $table->string('email')->nullable();
            $table->string('aadhaar_number')->nullable();
            $table->uuid('village_id')->nullable();
            $table->uuid('ward_id')->nullable();
            $table->uuid('polling_booth_id')->nullable();
            $table->string('address')->nullable();
            $table->string('education')->nullable();
            $table->string('occupation')->nullable();
            $table->string('volunteer_type')->default('general');
            $table->date('joining_date');
            $table->string('status')->default('active');
            $table->string('photo')->nullable();
            $table->text('skills')->nullable();
            $table->text('interests')->nullable();
            $table->string('blood_group')->nullable();
            $table->boolean('is_available')->default(true);
            $table->integer('total_activities')->default(0);
            $table->integer('total_hours')->default(0);
            $table->decimal('performance_score', 5, 2)->default(0);
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('citizen_id');
            $table->index('volunteer_id');
            $table->index('mobile_number');
            $table->index('village_id');
            $table->index('ward_id');
            $table->index('polling_booth_id');
            $table->index('status');
            $table->index('volunteer_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteers');
    }
};
