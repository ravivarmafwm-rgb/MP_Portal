<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('citizens', 'family_id')) {
            Schema::table('citizens', function (Blueprint $table): void {
                $table->uuid('family_id')->nullable()->after('unique_id');
            });
        }
        if (! Schema::hasColumn('citizens', 'relationship_to_head')) {
            Schema::table('citizens', function (Blueprint $table): void {
                $table->string('relationship_to_head', 80)->nullable()->after('family_id');
            });
        }
        if (! Schema::hasIndex('citizens', 'citizens_family_id_index')) {
            Schema::table('citizens', function (Blueprint $table): void {
                $table->index('family_id');
            });
        }
        if (! Schema::hasIndex('citizens', 'citizens_family_id_relationship_to_head_index')) {
            Schema::table('citizens', function (Blueprint $table): void {
                $table->index(['family_id', 'relationship_to_head']);
            });
        }

        if (! Schema::hasColumn('families', 'head_citizen_id')) {
            Schema::table('families', function (Blueprint $table): void {
                $table->uuid('head_citizen_id')->nullable()->after('family_id');
            });
        }
        if (! Schema::hasIndex('families', 'families_head_citizen_id_index')) {
            Schema::table('families', function (Blueprint $table): void {
                $table->index('head_citizen_id');
            });
        }

        // Backfill the canonical direct relationship from the existing pivot without
        // overwriting any relationship already established by a prior deployment.
        DB::table('family_members')->whereNull('deleted_at')->where('is_head', true)
            ->orderBy('id')->get()->each(function (object $member): void {
                DB::table('families')->where('id', $member->family_id)->whereNull('head_citizen_id')
                    ->update(['head_citizen_id' => $member->citizen_id]);
            });

        DB::table('family_members')->whereNull('deleted_at')->orderBy('id')->get()->each(function (object $member): void {
            DB::table('citizens')->where('id', $member->citizen_id)->whereNull('family_id')->update([
                'family_id' => $member->family_id,
                'relationship_to_head' => $member->relationship_with_head,
            ]);
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement("DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'citizens_family_id_foreign') THEN
                    ALTER TABLE citizens ADD CONSTRAINT citizens_family_id_foreign FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL NOT VALID;
                END IF;
            END $$;");
            DB::statement("DO $$ BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'families_head_citizen_id_foreign') THEN
                    ALTER TABLE families ADD CONSTRAINT families_head_citizen_id_foreign FOREIGN KEY (head_citizen_id) REFERENCES citizens(id) ON DELETE SET NULL NOT VALID;
                END IF;
            END $$;");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE citizens DROP CONSTRAINT IF EXISTS citizens_family_id_foreign');
            DB::statement('ALTER TABLE families DROP CONSTRAINT IF EXISTS families_head_citizen_id_foreign');
        }

        if (Schema::hasColumn('families', 'head_citizen_id')) {
            Schema::table('families', function (Blueprint $table): void {
                $table->dropIndex(['head_citizen_id']);
                $table->dropColumn('head_citizen_id');
            });
        }
        if (Schema::hasColumn('citizens', 'family_id')) {
            Schema::table('citizens', function (Blueprint $table): void {
                $table->dropIndex(['family_id', 'relationship_to_head']);
                $table->dropIndex(['family_id']);
                $table->dropColumn(['family_id', 'relationship_to_head']);
            });
        }
    }
};
