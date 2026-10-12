<?php
/**
 * wp eval-file: creates the legal pages from the theme's seed content if they do not exist.
 * Existing pages are never changed: editors own their content after the first deployment.
 */
$pages = [
    'impressum' => ['Impressum', 'Legal notice for Kaar Smart Techs.'],
    'datenschutz' => ['Privacy policy', 'Privacy policy (Datenschutzerklärung) for Kaar Smart Techs.'],
];

foreach ($pages as $slug => [$title, $description]) {
    if (get_page_by_path($slug)) {
        WP_CLI::log("/{$slug}/ exists, left unchanged.");

        continue;
    }

    $content = strtr(file_get_contents(get_template_directory()."/content/{$slug}.html"), [
        '{{contact_email}}' => KAAR_CONTACT_EMAIL,
        '{{retention_days}}' => (string) KAAR_CONTACT_RETENTION_DAYS,
    ]);
    $id = wp_insert_post([
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_name' => $slug,
        'post_title' => $title,
        'post_excerpt' => $description,
        'post_content' => $content,
    ], true);

    if (is_wp_error($id)) {
        WP_CLI::error("/{$slug}/: ".$id->get_error_message());
    }
    WP_CLI::success("Created /{$slug}/.");
}
