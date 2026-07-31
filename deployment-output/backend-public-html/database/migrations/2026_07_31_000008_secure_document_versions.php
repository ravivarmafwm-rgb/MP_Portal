<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_versions', function (Blueprint $table) {
            $table->string('storage_disk', 30)->default('local');
            $table->string('mime_type')->nullable();
            $table->string('checksum_sha256', 64)->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('document_versions', function (Blueprint $table) {
            $table->dropIndex(['checksum_sha256']);
            $table->dropColumn(['storage_disk', 'mime_type', 'checksum_sha256']);
        });
    }
};
