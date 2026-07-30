<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('benefit_disbursements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('disbursement_number')->unique();
            $table->uuid('scheme_id');
            $table->uuid('beneficiary_id');
            $table->uuid('application_id')->nullable();
            $table->decimal('amount', 15, 2);
            $table->string('payment_mode')->default('bank_transfer');
            $table->string('transaction_id')->nullable();
            $table->string('reference_number')->nullable();
            $table->date('disbursement_date');
            $table->uuid('disbursed_by')->nullable();
            $table->string('status')->default('completed');
            $table->string('failure_reason')->nullable();
            $table->date('retry_date')->nullable();
            $table->integer('retry_count')->default(0);
            $table->string('bank_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('disbursement_number');
            $table->index('scheme_id');
            $table->index('beneficiary_id');
            $table->index('application_id');
            $table->index('transaction_id');
            $table->index('disbursement_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('benefit_disbursements');
    }
};
