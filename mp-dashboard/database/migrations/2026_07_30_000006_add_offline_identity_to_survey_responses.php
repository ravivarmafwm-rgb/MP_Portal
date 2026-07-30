<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('survey_responses', function (Blueprint $table) {
            $table->uuid('client_submission_id')->nullable()->after('survey_id');
            $table->timestampTz('collected_at')->nullable()->after('response_time');
            $table->boolean('submitted_offline')->default(false)->after('collected_at');
            $table->unique(['survey_id', 'client_submission_id']);
            $table->index('collected_at');
        });
    }

    public function down(): void
    {
        Schema::table('survey_responses', function (Blueprint $table) {
            $table->dropUnique(['survey_id', 'client_submission_id']);
            $table->dropIndex(['collected_at']);
            $table->dropColumn(['client_submission_id', 'collected_at', 'submitted_offline']);
        });
    }
};
