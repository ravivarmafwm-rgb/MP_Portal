<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_invitations', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->foreignUuid('role_id')->constrained('roles')->restrictOnDelete();
            $table->foreignUuid('invited_by')->constrained('users')->restrictOnDelete();
            $table->foreignUuid('constituency_id')->nullable()->constrained('constituencies')->nullOnDelete();
            $table->foreignUuid('assembly_constituency_id')->nullable()->constrained('assembly_constituencies')->nullOnDelete();
            $table->foreignUuid('mandal_id')->nullable()->constrained('mandals')->nullOnDelete();
            $table->foreignUuid('village_id')->nullable()->constrained('villages')->nullOnDelete();
            $table->foreignUuid('ward_id')->nullable()->constrained('wards')->nullOnDelete();
            $table->foreignUuid('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->string('token_hash')->unique();
            $table->timestampTz('expires_at');
            $table->timestampTz('accepted_at')->nullable();
            $table->timestampsTz();
            $table->index(['email', 'accepted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_invitations');
    }
};
