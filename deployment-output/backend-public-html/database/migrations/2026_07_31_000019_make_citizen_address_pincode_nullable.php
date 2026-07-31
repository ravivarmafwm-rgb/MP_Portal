<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('citizen_addresses', fn (Blueprint $table) => $table->string('pincode')->nullable()->change());
    }

    public function down(): void
    {
        Schema::table('citizen_addresses', fn (Blueprint $table) => $table->string('pincode')->nullable(false)->change());
    }
};
