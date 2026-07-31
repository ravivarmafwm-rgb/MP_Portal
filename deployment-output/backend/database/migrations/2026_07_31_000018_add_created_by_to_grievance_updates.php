<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('grievance_updates', 'created_by')) {
            Schema::table('grievance_updates', function (Blueprint $table) {
                $table->uuid('created_by')->nullable()->after('updated_by')->index();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('grievance_updates', 'created_by')) {
            Schema::table('grievance_updates', fn (Blueprint $table) => $table->dropColumn('created_by'));
        }
    }
};
