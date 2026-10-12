<?php
/**
 * Client for the FastAPI service (KAAR_API_URL, e.g. http://api:8000).
 *
 * The project list is cached for a minute. The last good answer is also kept without expiry, so
 * the pages keep working from it while the API is down or restarting.
 */

defined('ABSPATH') || exit;

const KAAR_PROJECTS_CACHE_SECONDS = 60;

/**
 * @return array{categories: list<string>, projects: list<array<string, mixed>>}|null null when the
 *         API cannot be reached and there is no earlier answer to fall back on
 */
function kaar_projects(): ?array
{
    static $data = false;
    if ($data !== false) {
        return $data;
    }

    $data = get_transient('kaar_projects');
    if (is_array($data)) {
        return $data;
    }

    $response = wp_remote_get(KAAR_API_URL.'/api/projects', ['timeout' => 3]);
    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (wp_remote_retrieve_response_code($response) === 200 && isset($body['projects'], $body['categories'])) {
        $data = $body;
        set_transient('kaar_projects', $data, KAAR_PROJECTS_CACHE_SECONDS);
        update_option('kaar_projects_last_good', $data, false);

        return $data;
    }

    error_log('kaarsmarttechs: projects API unavailable: '.(is_wp_error($response)
        ? $response->get_error_message()
        : 'HTTP '.wp_remote_retrieve_response_code($response)));
    $data = get_option('kaar_projects_last_good', null);

    return $data;
}

/** @return array<string, mixed>|null */
function kaar_project(string $slug): ?array
{
    foreach (kaar_projects()['projects'] ?? [] as $project) {
        if ($project['slug'] === $slug) {
            return $project;
        }
    }

    return null;
}
