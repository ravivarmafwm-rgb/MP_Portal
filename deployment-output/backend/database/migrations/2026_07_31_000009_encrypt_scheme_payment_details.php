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
        Schema::table('scheme_applications', function (Blueprint $table) {
            $table->text('bank_account_ciphertext')->nullable();
            $table->string('bank_account_hash', 64)->nullable()->index();
            $table->text('bank_ifsc_ciphertext')->nullable();
        });
        Schema::table('scheme_beneficiaries', function (Blueprint $table) {
            $table->text('account_ciphertext')->nullable();
            $table->string('account_hash', 64)->nullable()->index();
            $table->text('ifsc_ciphertext')->nullable();
        });
        Schema::table('benefit_disbursements', function (Blueprint $table) {
            $table->text('account_ciphertext')->nullable();
            $table->string('account_hash', 64)->nullable()->index();
            $table->text('ifsc_ciphertext')->nullable();
            $table->unique('transaction_id');
        });

        $this->encryptTable('scheme_applications', 'bank_account_number', 'bank_ifsc', 'bank_account_ciphertext', 'bank_account_hash', 'bank_ifsc_ciphertext');
        $this->encryptTable('scheme_beneficiaries', 'account_number', 'ifsc_code', 'account_ciphertext', 'account_hash', 'ifsc_ciphertext');
        $this->encryptTable('benefit_disbursements', 'account_number', 'ifsc_code', 'account_ciphertext', 'account_hash', 'ifsc_ciphertext');
    }

    public function down(): void
    {
        $this->decryptTable('scheme_applications', 'bank_account_number', 'bank_ifsc', 'bank_account_ciphertext', 'bank_ifsc_ciphertext');
        $this->decryptTable('scheme_beneficiaries', 'account_number', 'ifsc_code', 'account_ciphertext', 'ifsc_ciphertext');
        $this->decryptTable('benefit_disbursements', 'account_number', 'ifsc_code', 'account_ciphertext', 'ifsc_ciphertext');

        Schema::table('benefit_disbursements', fn (Blueprint $table) => $table->dropUnique(['transaction_id']));
        Schema::table('scheme_applications', fn (Blueprint $table) => $table->dropColumn([
            'bank_account_ciphertext', 'bank_account_hash', 'bank_ifsc_ciphertext',
        ]));
        Schema::table('scheme_beneficiaries', fn (Blueprint $table) => $table->dropColumn([
            'account_ciphertext', 'account_hash', 'ifsc_ciphertext',
        ]));
        Schema::table('benefit_disbursements', fn (Blueprint $table) => $table->dropColumn([
            'account_ciphertext', 'account_hash', 'ifsc_ciphertext',
        ]));
    }

    private function encryptTable(
        string $table,
        string $accountColumn,
        string $ifscColumn,
        string $cipherColumn,
        string $hashColumn,
        string $ifscCipherColumn
    ): void {
        DB::table($table)->whereNotNull($accountColumn)->orderBy('id')->chunkById(100, function ($rows) use (
            $table, $accountColumn, $ifscColumn, $cipherColumn, $hashColumn, $ifscCipherColumn
        ) {
            foreach ($rows as $row) {
                $account = preg_replace('/\D/', '', (string) $row->{$accountColumn});
                DB::table($table)->where('id', $row->id)->update([
                    $cipherColumn => $account !== '' ? Crypt::encryptString($account) : null,
                    $hashColumn => $account !== '' ? hash_hmac('sha256', $account, config('app.key')) : null,
                    $ifscCipherColumn => $row->{$ifscColumn} ? Crypt::encryptString(strtoupper($row->{$ifscColumn})) : null,
                    $accountColumn => null,
                    $ifscColumn => null,
                ]);
            }
        }, 'id');
    }

    private function decryptTable(
        string $table,
        string $accountColumn,
        string $ifscColumn,
        string $cipherColumn,
        string $ifscCipherColumn
    ): void {
        DB::table($table)->whereNotNull($cipherColumn)->orderBy('id')->chunkById(100, function ($rows) use (
            $table, $accountColumn, $ifscColumn, $cipherColumn, $ifscCipherColumn
        ) {
            foreach ($rows as $row) {
                DB::table($table)->where('id', $row->id)->update([
                    $accountColumn => Crypt::decryptString($row->{$cipherColumn}),
                    $ifscColumn => $row->{$ifscCipherColumn} ? Crypt::decryptString($row->{$ifscCipherColumn}) : null,
                ]);
            }
        }, 'id');
    }
};
