<?php

namespace App\Support;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use InvalidArgumentException;
use Symfony\Component\Yaml\Yaml;

/**
 * Reads a project entry (YAML front matter + Markdown body) and validates it with the same
 * rules as the Astro content schema in src/content.config.ts.
 */
class ProjectFile
{
    /** @return array<string, mixed> attributes for the Project model */
    public static function parse(string $slug, string $contents): array
    {
        if (! preg_match('/\A---\R(.*?)\R---\R?(.*)\z/s', $contents, $m)) {
            throw new InvalidArgumentException("{$slug}: missing front matter");
        }

        $data = Yaml::parse($m[1]) ?? [];
        $data['flagship'] ??= false;
        $data['metrics'] ??= [];

        $validator = Validator::make($data, [
            'title' => ['required', 'string', 'min:2', 'max:60'],
            'tagline' => ['required', 'string', 'max:140'],
            'status' => ['required', Rule::in(config('site.statuses'))],
            'categories' => ['required', 'array', 'min:1', 'max:3'],
            'categories.*' => [Rule::in(config('site.categories'))],
            'flagship' => ['boolean'],
            'order' => ['required', 'integer'],
            'problem' => ['required', 'string'],
            'stack' => ['required', 'array', 'min:1'],
            'stack.*' => ['string'],
            'metrics' => ['array'],
            'metrics.*.label' => ['required', 'string'],
            'metrics.*.value' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException("{$slug}: ".implode(' ', $validator->errors()->all()));
        }

        return [
            'slug' => $slug,
            'title' => $data['title'],
            'tagline' => $data['tagline'],
            'status' => $data['status'],
            'categories' => $data['categories'],
            'flagship' => $data['flagship'],
            'sort_order' => $data['order'],
            'problem' => $data['problem'],
            'stack' => $data['stack'],
            // Only measured numbers are published; a missing value renders as "Measuring".
            'metrics' => array_map(fn (array $metric) => [
                'label' => $metric['label'],
                'value' => $metric['value'] ?? null,
            ], $data['metrics']),
            'body' => trim($m[2]),
        ];
    }
}
