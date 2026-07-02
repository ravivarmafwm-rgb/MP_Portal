<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('polling_booths', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->uuid('ward_id');
            $table->integer('booth_number');
            $table->string('building_name')->nullable();
            $table->string('address')->nullable();
            $table->integer('total_voters')->default(0);
            $table->integer('male_voters')->default(0);
            $table->integer('female_voters')->default(0);
            $table->string('presiding_officer')->nullable();
            $table->string('contact_number')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('ward_id');
            $table->index(['ward_id', 'booth_number']);
            $table->index('code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('polling_booths');
    }
};
