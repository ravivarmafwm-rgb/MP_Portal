<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mandals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('code')->unique();
            $table->uuid('assembly_constituency_id');
            $table->integer('total_villages')->default(0);
            $table->integer('total_voters')->default(0);
            $table->text('boundary')->nullable(); // GeoJSON stored as text
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->softDeletes();
            $table->uuid('created_by')->nullable();
            $table->uuid('updated_by')->nullable();
            $table->timestamps();

            $table->index('assembly_constituency_id');
            $table->index('code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mandals');
    }
};
