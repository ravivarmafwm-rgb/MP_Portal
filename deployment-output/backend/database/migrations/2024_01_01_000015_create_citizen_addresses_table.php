<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citizen_addresses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('citizen_id');
            $table->string('address_type')->default('permanent');
            $table->uuid('village_id')->nullable();
            $table->uuid('ward_id')->nullable();
            $table->uuid('polling_booth_id')->nullable();
            $table->string('house_number')->nullable();
            $table->string('street')->nullable();
            $table->string('locality')->nullable();
            $table->string('landmark')->nullable();
            $table->string('post_office')->nullable();
            $table->string('pincode');
            $table->string('district');
            $table->string('state');
            $table->string('country')->default('India');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->date('valid_from')->nullable();
            $table->date('valid_to')->nullable();
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('citizen_id');
            $table->index('village_id');
            $table->index('ward_id');
            $table->index('polling_booth_id');
            $table->index('pincode');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citizen_addresses');
    }
};
