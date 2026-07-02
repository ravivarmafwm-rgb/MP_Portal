<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheme_beneficiaries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('scheme_id');
            $table->uuid('citizen_id')->nullable();
            $table->uuid('family_id')->nullable();
            $table->uuid('application_id')->nullable();
            $table->string('beneficiary_name');
            $table->string('beneficiary_type')->default('individual');
            $table->date('enrollment_date');
            $table->string('status')->default('active');
            $table->decimal('total_benefit_received', 15, 2)->default(0);
            $table->integer('benefit_count')->default(0);
            $table->date('last_benefit_date')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('scheme_id');
            $table->index('citizen_id');
            $table->index('family_id');
            $table->index('application_id');
            $table->index('status');
            $table->index('enrollment_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheme_beneficiaries');
    }
};
