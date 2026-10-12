<?php
/**
 * WordPress configuration, read from the environment. Nothing secret is baked into the image.
 * See the table in wordpress/README.md.
 */

function kaar_env(string $name, ?string $default = null): string
{
    $value = getenv($name);
    if ($value === false || $value === '') {
        if ($default === null) {
            error_log("wp-config: {$name} is not set");
            http_response_code(500);
            exit(1);
        }

        return $default;
    }

    return $value;
}

define('DB_NAME', kaar_env('WORDPRESS_DB_NAME', 'wordpress'));
define('DB_USER', kaar_env('WORDPRESS_DB_USER', 'wordpress'));
define('DB_PASSWORD', kaar_env('WORDPRESS_DB_PASSWORD'));
define('DB_HOST', kaar_env('WORDPRESS_DB_HOST', 'mariadb'));
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');
$table_prefix = 'wp_';

// All eight keys and salts derive from one secret. Changing it logs everyone out.
foreach (['AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY', 'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT'] as $key) {
    define($key, hash_hmac('sha256', $key, kaar_env('WORDPRESS_SECRET')));
}

define('WP_HOME', rtrim(kaar_env('WORDPRESS_URL'), '/'));
define('WP_SITEURL', WP_HOME);
// TLS ends at the ingress; trust its X-Forwarded-Proto so WordPress builds https URLs.
if (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
define('FORCE_SSL_ADMIN', str_starts_with(WP_HOME, 'https://'));

// Code is baked into the image: no plugin/theme installs, file edits or self-updates at runtime.
// Upgrades ship as a new image; the setup job runs the database upgrade.
define('DISALLOW_FILE_MODS', true);
define('DISALLOW_FILE_EDIT', true);
define('AUTOMATIC_UPDATER_DISABLED', true);
define('WP_AUTO_UPDATE_CORE', false);
// Editors may not add scripts to pages; the CSP would block them anyway.
define('DISALLOW_UNFILTERED_HTML', true);
// Scheduled tasks run in the "cron" container, not on visitor requests.
define('DISABLE_WP_CRON', true);
// No outgoing requests (update checks, news feeds, avatars) except to the API service.
define('KAAR_API_URL', rtrim(kaar_env('KAAR_API_URL', 'http://api:8000'), '/'));
define('WP_HTTP_BLOCK_EXTERNAL', true);
define('WP_ACCESSIBLE_HOSTS', parse_url(KAAR_API_URL, PHP_URL_HOST));

define('WP_ENVIRONMENT_TYPE', kaar_env('WORDPRESS_ENV', 'production'));
define('WP_DEBUG', false);
define('WP_POST_REVISIONS', 20);
define('WP_DEFAULT_THEME', 'kaarsmarttechs');

define('KAAR_CONTACT_EMAIL', kaar_env('SITE_CONTACT_EMAIL', 'hello@kaarsmarttechs.com'));
// Must match the API's CONTACT_RETENTION_DAYS: the contact page and privacy policy state it.
define('KAAR_CONTACT_RETENTION_DAYS', (int) kaar_env('CONTACT_RETENTION_DAYS', '180'));
define('KAAR_VERSION', kaar_env('VERSION', 'dev'));

if (! defined('ABSPATH')) {
    define('ABSPATH', __DIR__.'/');
}

require_once ABSPATH.'wp-settings.php';
