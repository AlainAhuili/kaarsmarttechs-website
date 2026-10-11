<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Support\ProjectFile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Syncs the projects table with the Markdown entries: creates and updates by slug and removes
 * projects whose file was deleted. Safe to run on every deployment.
 */
class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $dir = config('site.projects_path');
        $files = glob($dir.'/*.md') ?: throw new RuntimeException("No project files found in {$dir}");

        $entries = array_map(
            fn (string $file) => ProjectFile::parse(basename($file, '.md'), file_get_contents($file)),
            $files,
        );

        DB::transaction(function () use ($entries) {
            foreach ($entries as $entry) {
                Project::updateOrCreate(['slug' => $entry['slug']], $entry);
            }

            Project::whereNotIn('slug', array_column($entries, 'slug'))->delete();
        });

        $this->command?->info(count($entries).' projects synced.');
    }
}
