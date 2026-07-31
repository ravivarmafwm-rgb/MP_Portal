<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('citizen_addresses', function (Blueprint $table) {
            $table->string('district')->nullable()->change();
            $table->string('state')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('citizen_addresses', function (Blueprint $table) {
            $table->string('district')->nullable(false)->change();
            $table->string('state')->nullable(false)->change();
        });
    }
};
