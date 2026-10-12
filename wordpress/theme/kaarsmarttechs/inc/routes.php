<?php
/**
 * URL map. The theme's own pages are rewrite rules to templates in templates/; WordPress pages
 * (Impressum, privacy policy and any page editors add) use page.php. Everything else WordPress
 * would serve (posts, archives, search, attachments, author pages) is a 404.
 *
 * After changing a rule: wp rewrite flush (the setup job does this on every deployment).
 */

defined('ABSPATH') || exit;

const KAAR_ROUTES = [
    '^services/?$' => 'services',
    '^contact/?$' => 'contact',
    '^projects/?$' => 'projects',
    '^projects/([a-z0-9-]+)/?$' => 'project',
];

add_action('init', function (): void {
    foreach (KAAR_ROUTES as $regex => $route) {
        $query = 'index.php?kaar_route='.$route.($route === 'project' ? '&kaar_project=$matches[1]' : '');
        add_rewrite_rule($regex, $query, 'top');
    }
});

add_filter('query_vars', fn (array $vars): array => [...$vars, 'kaar_route', 'kaar_project']);

// The theme's routes need no posts: skip the main query.
add_filter('posts_pre_query', function (?array $posts, WP_Query $query): ?array {
    return $query->is_main_query() && $query->get('kaar_route') ? [] : $posts;
}, 10, 2);

/** The response for this request: a template under templates/, '404' or 'unavailable'. */
function kaar_resolve(): ?string
{
    $route = get_query_var('kaar_route');
    if ($route === 'project') {
        if (kaar_projects() === null) {
            return 'unavailable';
        }

        return kaar_project((string) get_query_var('kaar_project')) ? 'project' : '404';
    }
    if ($route) {
        return $route === 'projects' && kaar_projects() === null ? 'unavailable' : $route;
    }
    if (is_front_page() && ! is_paged()) {
        return kaar_projects() === null ? 'unavailable' : 'front-page';
    }
    if (is_page()) {
        return null; // WordPress's own template hierarchy (page.php)
    }

    return '404';
}

// Priority 0: before redirect_canonical, so author archives (?author=1) do not leak user names.
add_action('template_redirect', function (): void {
    global $wp_query;

    $GLOBALS['kaar_template'] = kaar_resolve();
    if ($GLOBALS['kaar_template'] === '404') {
        $wp_query->set_404();
        status_header(404);
        nocache_headers();
    } elseif ($GLOBALS['kaar_template'] === 'unavailable') {
        status_header(503);
        header('Retry-After: 60');
        nocache_headers();
    }
}, 0);

add_filter('template_include', function (string $template): string {
    return match ($GLOBALS['kaar_template'] ?? null) {
        null => $template,
        '404' => get_404_template(),
        'front-page' => get_front_page_template(),
        default => locate_template('templates/'.$GLOBALS['kaar_template'].'.php') ?: $template,
    };
});

// /projects/x and /projects/x/ are the same page; never redirect theme routes to a guessed post.
add_filter('redirect_canonical', fn ($redirect) => get_query_var('kaar_route') ? false : $redirect);
add_filter('do_redirect_guess_404_permalink', '__return_false');
