<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schemes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('category');
            $table->uuid('department_id')->nullable();
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();
            $table->text('eligibility')->nullable();
            $table->text('benefits')->nullable();
            $table->text('documents_required')->nullable();
            $table->decimal('max_amount', 15, 2)->nullable();
            $table->string('funding_source')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('application_mode')->default('online');
            $table->string('approval_authority')->nullable();
            $table->integer('sla_days')->default(30);
            $table->string('website_url')->nullable();
            $table->string('helpline_number')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('code');
            $table->index('category');
            $table->index('department_id');
            $table->index('is_active');
            $table->index('start_date');
            $table->index('end_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schemes');
    }
};
