<?php
/**
 * kaarsmarttechs.com on WordPress.
 *
 * WordPress renders every page and owns the editable legal pages (Impressum, privacy policy).
 * Projects come from the FastAPI service (inc/api.php); the contact form posts to it directly.
 */

defined('ABSPATH') || exit;

require __DIR__.'/inc/api.php';
require __DIR__.'/inc/routes.php';
require __DIR__.'/inc/hardening.php';
require __DIR__.'/inc/layout.php';

add_action('after_setup_theme', function (): void {
    // Pages are the only editable content type; titles are printed by the layout itself.
    remove_theme_support('core-block-patterns');
    add_post_type_support('page', 'excerpt'); // the excerpt is the page's meta description
});
