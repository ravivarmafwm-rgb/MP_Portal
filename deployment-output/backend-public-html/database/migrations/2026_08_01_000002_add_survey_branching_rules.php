<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('survey_questions')) {
            Schema::table('survey_questions', function (Blueprint $table): void {
                if (! Schema::hasColumn('survey_questions', 'branching_rules')) $table->json('branching_rules')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('survey_questions') && Schema::hasColumn('survey_questions', 'branching_rules')) Schema::table('survey_questions', fn (Blueprint $table) => $table->dropColumn('branching_rules'));
    }
};
