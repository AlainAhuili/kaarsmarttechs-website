<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $fillable = [
        'slug', 'title', 'tagline', 'status', 'categories', 'flagship',
        'sort_order', 'problem', 'stack', 'metrics', 'body',
    ];

    protected function casts(): array
    {
        return [
            'categories' => 'array',
            'stack' => 'array',
            'metrics' => 'array',
            'flagship' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** Flagship first, then by explicit order, then by slug for a stable result. */
    #[Scope]
    protected function ordered(Builder $query): void
    {
        $query->orderByDesc('flagship')->orderBy('sort_order')->orderBy('slug');
    }

    /** URL-safe tag used by the client-side filter, e.g. "Cloud & DevOps" -> "cloud-devops". */
    public static function categorySlug(string $category): string
    {
        $slug = preg_replace('/[^a-z0-9]+/', '-', str_replace('&', ' ', strtolower($category)));

        return trim($slug, '-');
    }

    /** Space-separated category slugs for the data-categories attribute. */
    public function categorySlugs(): string
    {
        return implode(' ', array_map(self::categorySlug(...), $this->categories));
    }

    /** The case-study body. Entries come from the repository, but raw HTML is still stripped. */
    public function bodyHtml(): string
    {
        return (string) Str::markdown($this->body ?? '', [
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);
    }
}
