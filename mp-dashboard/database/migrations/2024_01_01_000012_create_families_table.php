<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('families', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('family_id')->unique();
            $table->uuid('village_id');
            $table->uuid('ward_id')->nullable();
            $table->uuid('polling_booth_id')->nullable();
            $table->string('head_of_family_name');
            $table->string('house_number')->nullable();
            $table->string('street')->nullable();
            $table->string('locality')->nullable();
            $table->integer('members_count')->default(0);
            $table->integer('voters_count')->default(0);
            $table->string('ration_card_number')->nullable();
            $table->string('ration_card_type')->nullable();
            $table->string('annual_income')->nullable();
            $table->string('economic_status')->default('middle');
            $table->string('caste')->nullable();
            $table->string('religion')->nullable();
            $table->boolean('is_bpl')->default(false);
            $table->text('remarks')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('village_id');
            $table->index('ward_id');
            $table->index('polling_booth_id');
            $table->index('family_id');
            $table->index(['village_id', 'house_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('families');
    }
};
