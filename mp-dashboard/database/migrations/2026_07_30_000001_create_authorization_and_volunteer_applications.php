<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permission_role', function (Blueprint $table) {
            $table->foreignUuid('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->foreignUuid('role_id')->constrained('roles')->cascadeOnDelete();
            $table->primary(['permission_id', 'role_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignUuid('constituency_id')->nullable()->constrained('constituencies')->nullOnDelete();
            $table->foreignUuid('assembly_constituency_id')->nullable()->constrained('assembly_constituencies')->nullOnDelete();
            $table->foreignUuid('mandal_id')->nullable()->constrained('mandals')->nullOnDelete();
            $table->foreignUuid('village_id')->nullable()->constrained('villages')->nullOnDelete();
            $table->foreignUuid('ward_id')->nullable()->constrained('wards')->nullOnDelete();
            $table->foreignUuid('department_id')->nullable()->constrained('departments')->nullOnDelete();
            $table->boolean('is_active')->default(true)->index();
        });

        Schema::create('volunteer_applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email')->unique();
            $table->string('mobile_number', 15)->unique();
            $table->date('date_of_birth');
            $table->string('gender', 20);
            $table->foreignUuid('village_id')->constrained('villages')->restrictOnDelete();
            $table->foreignUuid('ward_id')->nullable()->constrained('wards')->nullOnDelete();
            $table->text('address');
            $table->text('motivation');
            $table->string('status', 20)->default('pending')->index();
            $table->text('review_notes')->nullable();
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_applications');
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('constituency_id');
            $table->dropConstrainedForeignId('assembly_constituency_id');
            $table->dropConstrainedForeignId('mandal_id');
            $table->dropConstrainedForeignId('village_id');
            $table->dropConstrainedForeignId('ward_id');
            $table->dropConstrainedForeignId('department_id');
            $table->dropColumn('is_active');
        });
        Schema::dropIfExists('permission_role');
    }
};
