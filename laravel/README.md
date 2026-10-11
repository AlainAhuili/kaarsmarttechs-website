# kaarsmarttechs.com on Laravel

The second release artifact of the website: Laravel 13 on PHP 8.5 with MySQL 8.4, served by nginx.
The overview, images and pipeline are described in the [root README](../README.md).

## What is different from the Astro site

- Projects are stored in MySQL. `php artisan db:seed` syncs them from `../src/content/projects`
  (creates, updates and deletes by slug), with the same validation rules as the Astro schema.
- `/contact/` has a form. Messages go to the `contact_messages` table, are rate limited
  (3 per minute and 20 per day per visitor), have a honeypot field against bots and are deleted
  after `SITE_CONTACT_RETENTION_DAYS` (default 180) by the scheduled `model:prune` command.
- Only `/contact/` uses the session middleware. All other pages set no cookies.

## Develop without Docker

Requires PHP 8.5 with `pdo_mysql`, Composer and a MySQL 8.4 database.

```bash
cd laravel
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed
php artisan serve          # http://localhost:8000
vendor/bin/pint            # format
php artisan test           # SQLite in memory by default; set DB_CONNECTION=mysql to use MySQL
```

## Configuration in production

| Variable                      | Purpose                                                                |
| ----------------------------- | ---------------------------------------------------------------------- |
| `APP_KEY`                     | Encryption key for sessions and cookies. Keep it secret and stable.    |
| `APP_URL`                     | Public URL, used for canonical links.                                  |
| `DB_*`                        | MySQL connection.                                                      |
| `SESSION_SECURE_COOKIE=true`  | Required behind HTTPS.                                                 |
| `TRUSTED_PROXIES`             | Ingress/load balancer addresses, so rate limits apply per visitor.     |
| `SITE_CONTACT_RETENTION_DAYS` | Days before contact messages are deleted. Must match the privacy page. |

Run `php artisan migrate --force && php artisan db:seed --force` once per release before the new
app containers take traffic (the `migrate` service in `docker-compose.yml` does this), and run
`php artisan schedule:work` in one container (the `scheduler` service).

The web image expects the PHP-FPM container at `app:9000` (see `docker/nginx.conf`).

## Before going live

The Impressum and privacy policy views (`resources/views/pages/`) have the same placeholders as the
Astro pages; the privacy policy here also covers the contact form and its session cookie.
