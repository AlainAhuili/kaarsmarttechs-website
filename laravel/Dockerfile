# Second release artifact: kaarsmarttechs.com as a Laravel application.
#
# Build context is the repository root, so the image uses the same project entries
# (src/content/projects), security headers (docker/security-headers.conf) and self-hosted fonts
# as the Astro site:
#
#   docker build -f laravel/Dockerfile --target app -t website-laravel-app .   # PHP-FPM on :9000
#   docker build -f laravel/Dockerfile --target web -t website-laravel-web .   # nginx on :8080

# ---- Composer dependencies -------------------------------------------------------
FROM composer:2 AS vendor
WORKDIR /app
COPY laravel/composer.json laravel/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction --no-progress
COPY laravel/ ./
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative --no-scripts

# ---- Self-hosted fonts, from the same @fontsource versions as the Astro site --------
FROM node:24-alpine AS fonts
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund \
 && mkdir -p out/archivo out/ibm-plex-sans \
 && cp -r node_modules/@fontsource-variable/archivo/wdth.css node_modules/@fontsource-variable/archivo/files out/archivo/ \
 && cp -r node_modules/@fontsource/ibm-plex-sans/400.css node_modules/@fontsource/ibm-plex-sans/500.css \
          node_modules/@fontsource/ibm-plex-sans/files out/ibm-plex-sans/

# ---- app: PHP-FPM ------------------------------------------------------------------
FROM php:8.5-fpm-alpine AS app
# pick up Alpine security fixes published after the base image was built
RUN apk upgrade --no-cache \
 && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
 && docker-php-ext-install -j"$(nproc)" pdo_mysql \
 && apk del .build-deps \
 && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY laravel/docker/php.ini "$PHP_INI_DIR/conf.d/zz-website.ini"
WORKDIR /var/www/html
COPY --from=vendor /app ./
# config/site.php reads ../src/content/projects relative to the app.
COPY src/content/projects /var/www/src/content/projects
# The container filesystem is read-only: log to stderr and compile Blade views into /tmp, which
# is a tmpfs in docker-compose.yml (an emptyDir on Kubernetes). Packages are discovered at build time.
ENV LOG_CHANNEL=stderr \
    VIEW_COMPILED_PATH=/tmp/views
ARG VERSION=dev
RUN mkdir -p bootstrap/cache \
 && php artisan package:discover --ansi \
 && echo "$VERSION" > public/version.txt
USER www-data
EXPOSE 9000
# php-fpm is the base image's default command.

# ---- web: nginx serving public/ and passing PHP requests to the app ----------------
FROM nginxinc/nginx-unprivileged:1.31.6-alpine AS web
USER root
RUN apk upgrade --no-cache
COPY laravel/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY laravel/public /var/www/html/public
COPY --from=fonts /build/out /var/www/html/public/fonts
ARG VERSION=dev
RUN echo "$VERSION" > /var/www/html/public/version.txt
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
