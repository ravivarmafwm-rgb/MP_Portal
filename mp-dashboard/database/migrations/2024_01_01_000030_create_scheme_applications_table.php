<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheme_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('application_number')->unique();
            $table->uuid('scheme_id');
            $table->uuid('citizen_id')->nullable();
            $table->uuid('family_id')->nullable();
            $table->string('applicant_name');
            $table->string('applicant_mobile');
            $table->string('applicant_email')->nullable();
            $table->uuid('village_id')->nullable();
            $table->uuid('ward_id')->nullable();
            $table->string('status')->default('pending');
            $table->date('application_date');
            $table->uuid('processed_by')->nullable();
            $table->date('processed_date')->nullable();
            $table->string('rejection_reason')->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('sanctioned_amount', 15, 2)->nullable();
            $table->date('sanction_date')->nullable();
            $table->string('sanction_order_number')->nullable();
            $table->string('payment_status')->default('pending');
            $table->date('payment_date')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_ifsc')->nullable();
            $table->string('bank_name')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('application_number');
            $table->index('scheme_id');
            $table->index('citizen_id');
            $table->index('family_id');
            $table->index('village_id');
            $table->index('ward_id');
            $table->index('status');
            $table->index('application_date');
            $table->index('processed_by');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheme_applications');
    }
};
