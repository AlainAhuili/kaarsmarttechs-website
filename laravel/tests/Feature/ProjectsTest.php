<?php

namespace Tests\Feature;

use App\Models\Project;
use Database\Seeders\ProjectSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectsTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    public function test_seeder_loads_every_markdown_entry(): void
    {
        $files = glob(config('site.projects_path').'/*.md');

        $this->assertNotEmpty($files);
        $this->assertSame(count($files), Project::count());
    }

    public function test_flagship_comes_first_then_explicit_order(): void
    {
        $projects = Project::ordered()->get();

        $this->assertTrue($projects->first()->flagship);
        $others = $projects->where('flagship', false)->pluck('sort_order')->all();
        $this->assertSame($others, collect($others)->sort()->values()->all());
    }

    public function test_seeder_is_idempotent_and_removes_deleted_entries(): void
    {
        $count = Project::count();
        Project::create([
            'slug' => 'removed-project', 'title' => 'Removed', 'tagline' => 'Gone', 'status' => 'Internal',
            'categories' => ['Code Quality'], 'sort_order' => 99, 'problem' => 'None', 'stack' => ['PHP'], 'metrics' => [],
        ]);

        $this->seed(ProjectSeeder::class);

        $this->assertSame($count, Project::count());
        $this->assertDatabaseMissing('projects', ['slug' => 'removed-project']);
    }

    public function test_case_study_renders_markdown_body_and_unmeasured_metrics(): void
    {
        $this->get('/projects/lego-sorting-system/')
            ->assertOk()
            ->assertSee('<h2>How it works</h2>', false)
            ->assertSee('Results')
            ->assertSee('Measuring');
    }

    public function test_projects_page_lists_every_project_with_filter_tags(): void
    {
        $response = $this->get('/projects/')->assertOk();

        foreach (Project::all() as $project) {
            $response->assertSee('href="/projects/'.$project->slug.'/"', false)
                ->assertSee('data-categories="'.$project->categorySlugs().'"', false);
        }
        $response->assertSee('<script src="/js/projects-filter.js" defer></script>', false);
    }

    public function test_unknown_project_returns_404(): void
    {
        $this->get('/projects/does-not-exist/')->assertNotFound();
    }
}
