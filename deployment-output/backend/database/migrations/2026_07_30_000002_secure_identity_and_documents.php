<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['citizens', 'volunteers'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->text('aadhaar_ciphertext')->nullable();
                $table->char('aadhaar_hash', 64)->nullable()->unique();
            });
            DB::table($tableName)->whereNotNull('aadhaar_number')->orderBy('id')->chunk(250, function ($rows) use ($tableName) {
                foreach ($rows as $row) {
                    $digits = preg_replace('/\D/', '', (string) $row->aadhaar_number);
                    DB::table($tableName)->where('id', $row->id)->update([
                        'aadhaar_ciphertext' => $digits !== '' ? Crypt::encryptString($digits) : null,
                        'aadhaar_hash' => $digits !== '' ? hash_hmac('sha256', $digits, config('app.key')) : null,
                        'aadhaar_number' => null,
                    ]);
                }
            });
        }

        Schema::table('documents', function (Blueprint $table) {
            $table->string('storage_disk', 30)->default('public');
            $table->string('checksum_sha256', 64)->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('documents', fn (Blueprint $table) => $table->dropColumn(['storage_disk', 'checksum_sha256']));
        foreach (['citizens', 'volunteers'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropUnique(['aadhaar_hash']);
                $table->dropColumn(['aadhaar_ciphertext', 'aadhaar_hash']);
            });
        }
    }
};
