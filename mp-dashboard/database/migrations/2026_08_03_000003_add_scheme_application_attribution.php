<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('scheme_applications', 'submitted_by')) {
            Schema::table('scheme_applications', function (Blueprint $table): void {
                $table->uuid('submitted_by')->nullable()->after('created_by');
            });
        }
        if (! Schema::hasColumn('scheme_applications', 'application_source')) {
            Schema::table('scheme_applications', function (Blueprint $table): void {
                $table->string('application_source', 30)->default('citizen')->after('submitted_by');
            });
        }
        if (! Schema::hasColumn('scheme_applications', 'pending_reason')) {
            Schema::table('scheme_applications', function (Blueprint $table): void {
                $table->text('pending_reason')->nullable()->after('rejection_reason');
            });
        }
        if (! Schema::hasIndex('scheme_applications', 'scheme_applications_application_source_submitted_by_index')) {
            Schema::table('scheme_applications', function (Blueprint $table): void {
                $table->index(['application_source', 'submitted_by']);
            });
        }
    }

    public function down(): void
    {
        Schema::table('scheme_applications', function (Blueprint $table): void {
            $table->dropIndex(['application_source', 'submitted_by']);
            $table->dropColumn(['submitted_by', 'application_source', 'pending_reason']);
        });
    }
};
