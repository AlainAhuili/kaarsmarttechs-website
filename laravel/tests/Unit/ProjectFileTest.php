<?php

namespace Tests\Unit;

use App\Models\Project;
use App\Support\ProjectFile;
use InvalidArgumentException;
use Tests\TestCase;

class ProjectFileTest extends TestCase
{
    private const VALID = <<<'MD'
        ---
        title: Example Project
        tagline: A short tagline.
        status: Internal
        categories: ["Cloud & DevOps"]
        order: 7
        problem: Something is slow.
        stack: ["PHP", "MySQL"]
        metrics:
          - label: Requests per second
          - label: Uptime
            value: "99.9 %"
        ---

        ## Body

        Text.
        MD;

    public function test_parses_front_matter_and_body(): void
    {
        $project = ProjectFile::parse('example', self::VALID);

        $this->assertSame('example', $project['slug']);
        $this->assertSame(7, $project['sort_order']);
        $this->assertFalse($project['flagship']);
        $this->assertSame([
            ['label' => 'Requests per second', 'value' => null],
            ['label' => 'Uptime', 'value' => '99.9 %'],
        ], $project['metrics']);
        $this->assertSame("## Body\n\nText.", $project['body']);
    }

    public function test_rejects_values_the_astro_schema_rejects(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('example:');

        ProjectFile::parse('example', str_replace('status: Internal', 'status: Finished', self::VALID));
    }

    public function test_rejects_a_file_without_front_matter(): void
    {
        $this->expectException(InvalidArgumentException::class);

        ProjectFile::parse('example', "# Just Markdown\n");
    }

    public function test_category_slug_matches_the_astro_helper(): void
    {
        $this->assertSame('cloud-devops', Project::categorySlug('Cloud & DevOps'));
        $this->assertSame('ai-agentic-tooling', Project::categorySlug('AI & Agentic Tooling'));
        $this->assertSame('computer-vision', Project::categorySlug('Computer Vision'));
    }
}
