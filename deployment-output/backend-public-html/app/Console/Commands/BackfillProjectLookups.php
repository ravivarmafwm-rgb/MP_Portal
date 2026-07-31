<?php

namespace App\Console\Commands;

use App\Models\Department;
use App\Models\Project;
use App\Models\ProjectAgency;
use App\Models\ProjectCategory;
use App\Models\ProjectType;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class BackfillProjectLookups extends Command
{
    protected $signature = 'projects:backfill-lookups {--dry-run : Report matches without writing IDs} {--create-missing : Create lookup records for distinct legacy values before matching}';

    protected $description = 'Backfill project lookup IDs from legacy free-text values without overwriting existing IDs';

    public function handle(): int
    {
        $lookups = [
            'project_category_id' => [ProjectCategory::class, 'category'],
            'project_type_id' => [ProjectType::class, 'project_type'],
            'department_id' => [Department::class, 'department'],
        ];
        $maps = [];
        foreach ($lookups as $idColumn => [$model, $legacyColumn]) {
            if ($this->option('create-missing') && !$this->option('dry-run') && in_array($model, [ProjectCategory::class, ProjectType::class], true)) {
                $this->createMissingLookupValues($model, $legacyColumn);
            }
            $maps[$idColumn] = $this->lookupMap($model);
            $this->line(sprintf('%s: %d lookup values loaded', $legacyColumn, count($maps[$idColumn])));
        }
        if (!Schema::hasColumn('projects', 'agency')) {
            $this->warn('Agency backfill skipped: projects has no legacy agency column; no source value exists to convert.');
            Log::warning('Legacy project agency backfill skipped because projects.agency does not exist.');
        }

        $updated = 0;
        $unmapped = 0;
        $query = Project::query()->select(['id', 'project_number', 'name', 'project_category_id', 'project_type_id', 'department_id', 'category', 'project_type', 'department']);

        $query->chunkById(250, function ($projects) use (&$updated, &$unmapped, $maps) {
            foreach ($projects as $project) {
                $changes = [];
                foreach ($maps as $idColumn => $map) {
                    if ($project->{$idColumn} || !filled($project->{$this->legacyColumn($idColumn)})) {
                        continue;
                    }
                    $legacyColumn = $this->legacyColumn($idColumn);
                    $value = trim((string) $project->{$legacyColumn});
                    $key = $this->normalize($value);
                    if (isset($map[$key])) {
                        $changes[$idColumn] = $map[$key];
                    } else {
                        $unmapped++;
                        Log::warning('Unmapped legacy project lookup value', [
                            'project_id' => $project->id,
                            'project_number' => $project->project_number,
                            'lookup' => $legacyColumn,
                            'value' => $value,
                        ]);
                        $this->warn(sprintf('Unmapped %s "%s" on %s', $legacyColumn, $value, $project->project_number));
                    }
                }
                if ($changes && !$this->option('dry-run')) {
                    DB::transaction(fn () => Project::whereKey($project->id)->update($changes));
                }
                $updated += count($changes);
            }
        }, 'id');

        $this->info(sprintf('%s: %d lookup IDs %s; %d values unmapped (logged)', static::class, $updated, $this->option('dry-run') ? 'would be populated' : 'populated', $unmapped));
        return self::SUCCESS;
    }

    private function createMissingLookupValues(string $model, string $legacyColumn): void
    {
        Project::query()->whereNull($this->idColumnForLegacy($legacyColumn))->whereNotNull($legacyColumn)->pluck($legacyColumn)->filter()->unique()->each(function ($value) use ($model): void {
            $name = trim((string) $value);
            $code = Str::upper(Str::slug($name, '_'));
            if ($code === '' || $model::withTrashed()->where('name', $name)->exists()) return;
            $model::create(['name' => $name, 'code' => $code, 'is_active' => true]);
            $this->info("Created {$model} lookup {$name} ({$code})");
        });
    }

    private function idColumnForLegacy(string $legacyColumn): string
    {
        return match ($legacyColumn) {
            'category' => 'project_category_id',
            'project_type' => 'project_type_id',
            default => throw new \InvalidArgumentException("No ID column mapped for {$legacyColumn}"),
        };
    }

    private function lookupMap(string $model): array
    {
        $map = [];
        foreach ($model::query()->get(['id', 'name', 'code']) as $row) {
            foreach ([$row->name, $row->code] as $value) {
                $key = $this->normalize($value);
                if ($key === '') {
                    continue;
                }
                if (array_key_exists($key, $map) && $map[$key] !== $row->id) {
                    $map[$key] = null; // Ambiguous normalized values are never auto-matched.
                } elseif (!array_key_exists($key, $map)) {
                    $map[$key] = $row->id;
                }
            }
        }
        return array_filter($map, static fn ($id) => $id !== null);
    }

    private function legacyColumn(string $idColumn): string
    {
        return match ($idColumn) {
            'project_category_id' => 'category',
            'project_type_id' => 'project_type',
            'department_id' => 'department',
            default => throw new \InvalidArgumentException("No legacy column mapped for {$idColumn}"),
        };
    }

    private function normalize(?string $value): string
    {
        return Str::of((string) $value)->lower()->replace(['-', '_', '/'], ' ')->squish()->value();
    }
}
