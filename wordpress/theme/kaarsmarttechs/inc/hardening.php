<?php
/**
 * Keeps the public pages within the site's rules: no inline scripts (CSP script-src 'self'), no
 * third-party requests, no cookies, and nothing public beyond the pages themselves.
 */

defined('ABSPATH') || exit;

// ---- <head> output: only what the layout prints, plus what plugins add through wp_head().
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'rel_canonical'); // the layout prints the canonical link
remove_action('wp_head', 'wp_site_icon', 99);
remove_action('template_redirect', 'rest_output_link_header', 11);
remove_action('template_redirect', 'wp_shortlink_header', 11);
add_filter('wp_speculation_rules_configuration', '__return_null'); // inline <script type="speculationrules">
add_filter('show_admin_bar', '__return_false'); // its scripts and styles are inline
add_filter('wp_img_tag_add_auto_sizes', '__return_false'); // inline <style> for sizes="auto"

remove_filter('wp_robots', 'wp_robots_max_image_preview_large');
// Block editor styles: the pages are styled by assets/site.css alone.
remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
remove_action('wp_enqueue_scripts', 'wp_enqueue_classic_theme_styles');
add_action('wp_enqueue_scripts', function (): void {
    wp_dequeue_style('wp-block-library');
}, 100);

// ---- No feeds, XML-RPC, sitemaps (they list user names) or comments.
foreach (['do_feed', 'do_feed_rdf', 'do_feed_rss', 'do_feed_rss2', 'do_feed_atom'] as $feed) {
    add_action($feed, function (): void {
        wp_die('Not found', '', ['response' => 404]);
    }, 1);
}
add_filter('xmlrpc_enabled', '__return_false');
add_filter('wp_headers', function (array $headers): array {
    unset($headers['X-Pingback']);

    return $headers;
});
add_filter('wp_sitemaps_enabled', '__return_false');
add_filter('comments_open', '__return_false');
add_filter('pings_open', '__return_false');

// ---- The REST API is for the block editor only: it would otherwise list user names publicly.
add_filter('rest_authentication_errors', function ($result) {
    if ($result === null && ! is_user_logged_in()) {
        return new WP_Error('rest_login_required', 'Authentication required.', ['status' => 401]);
    }

    return $result;
});

