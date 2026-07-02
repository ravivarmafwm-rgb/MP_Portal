<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scheme_eligibility_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('scheme_id');
            $table->string('rule_name');
            $table->string('rule_type');
            $table->text('condition')->nullable();
            $table->string('field_name')->nullable();
            $table->string('operator')->nullable();
            $table->string('value')->nullable();
            $table->boolean('is_mandatory')->default(true);
            $table->integer('sort_order')->default(0);
            $table->text('error_message')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('scheme_id');
            $table->index('rule_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scheme_eligibility_rules');
    }
};
