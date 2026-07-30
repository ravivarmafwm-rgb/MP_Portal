<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citizens', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('unique_id')->unique();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('spouse_name')->nullable();
            $table->date('date_of_birth');
            $table->string('gender');
            $table->string('aadhaar_number')->nullable()->unique();
            $table->string('voter_id')->nullable()->unique();
            $table->string('mobile_number')->nullable();
            $table->string('alternate_mobile')->nullable();
            $table->string('email')->nullable();
            $table->string('education')->nullable();
            $table->string('occupation')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('blood_group')->nullable();
            $table->string('disability_status')->default('none');
            $table->text('disability_details')->nullable();
            $table->boolean('is_voter')->default(false);
            $table->string('voter_status')->nullable();
            $table->boolean('is_deceased')->default(false);
            $table->date('date_of_death')->nullable();
            $table->string('photo')->nullable();
            $table->text('biometric_data')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('unique_id');
            $table->index('aadhaar_number');
            $table->index('voter_id');
            $table->index('mobile_number');
            $table->index(['first_name', 'last_name']);
            $table->index('date_of_birth');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citizens');
    }
};
