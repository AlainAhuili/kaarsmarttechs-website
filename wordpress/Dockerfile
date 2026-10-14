# Release artifact: kaarsmarttechs.com on WordPress + nginx + FastAPI + MariaDB.
#
# Build context is the repository root, so the images use the same project entries
# (src/content/projects), security headers (docker/security-headers.conf), favicon and
# self-hosted fonts as the Astro site:
#
#   docker build -f wordpress/Dockerfile --target app -t website-wordpress-app .   # PHP-FPM on :9000
#   docker build -f wordpress/Dockerfile --target api -t website-wordpress-api .   # FastAPI on :8000
#   docker build -f wordpress/Dockerfile --target web -t website-wordpress-web .   # nginx on :8080

# ---- Upstream sources, as stages so Dependabot can update them -----------------------
# WordPress core is copied out of the official image rather than built on it: that image declares
# VOLUME /var/www/html, which would keep serving the previous release's code after an update.
FROM wordpress:7.1-php8.5-fpm-alpine AS wordpress-core
FROM wordpress:cli-2.12-php8.5 AS wp-cli

# ---- Self-hosted fonts, pinned in the root package-lock.json (Astro now uses Inter) ----
FROM node:25-alpine AS fonts
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund \
 && mkdir -p out/archivo out/ibm-plex-sans \
 && cp -r node_modules/@fontsource-variable/archivo/wdth.css node_modules/@fontsource-variable/archivo/files out/archivo/ \
 && cp -r node_modules/@fontsource/ibm-plex-sans/400.css node_modules/@fontsource/ibm-plex-sans/500.css \
          node_modules/@fontsource/ibm-plex-sans/files out/ibm-plex-sans/

# ---- app: WordPress on PHP-FPM, with WP-CLI for the setup job ------------------------
FROM php:8.5-fpm-alpine AS app
# pick up Alpine security fixes published after the base image was built
RUN apk upgrade --no-cache \
 && apk add --no-cache freetype icu-libs libjpeg-turbo libpng libwebp libzip \
 && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS freetype-dev icu-dev libjpeg-turbo-dev \
      libpng-dev libwebp-dev libzip-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install -j"$(nproc)" exif gd intl mysqli zip \
 && apk del .build-deps \
 && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY wordpress/docker/php.ini "$PHP_INI_DIR/conf.d/zz-website.ini"
COPY --from=wp-cli /usr/local/bin/wp /usr/local/bin/wp
WORKDIR /var/www/html
COPY --from=wordpress-core /usr/src/wordpress ./
# Bundled extras are not used: sample config, version disclosure, plugins and default themes.
RUN rm -rf wp-config-docker.php wp-config-sample.php readme.html license.txt \
      wp-content/plugins/* wp-content/themes/* \
 && install -d -o www-data -g www-data wp-content/uploads
COPY wordpress/wp-config.php ./
COPY wordpress/theme/kaarsmarttechs wp-content/themes/kaarsmarttechs
COPY wordpress/bin/kaar-setup /usr/local/bin/kaar-setup
COPY wordpress/bin/seed-pages.php /usr/local/share/kaarsmarttechs/seed-pages.php
# The container filesystem is read-only except /tmp (a tmpfs in docker-compose.yml, an emptyDir
# on Kubernetes) and wp-content/uploads (a volume shared with the web container).
ARG VERSION=dev
ENV VERSION=$VERSION \
    WP_CLI_CACHE_DIR=/tmp/wp-cli-cache
USER www-data
EXPOSE 9000
# php-fpm is the base image's default command.

# ---- api: FastAPI on uvicorn ---------------------------------------------------------
FROM python:3.14-slim AS api
# pick up Debian security fixes published after the base image was built
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PROJECTS_PATH=/srv/content/projects
WORKDIR /srv/api
COPY wordpress/api/requirements.txt ./
# pip is not needed at runtime; removing it also removes its vendored libraries from the scan.
RUN pip install --no-cache-dir --root-user-action=ignore --disable-pip-version-check -r requirements.txt \
 && pip uninstall --yes --root-user-action=ignore pip
COPY wordpress/api/app ./app
COPY src/content/projects /srv/content/projects
ARG VERSION=dev
ENV VERSION=$VERSION
USER nobody
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=2)"
# X-Forwarded-For is evaluated by the app itself (TRUSTED_PROXY_HOPS), not by uvicorn.
CMD ["uvicorn", "--factory", "app.main:create_app", "--host", "0.0.0.0", "--port", "8000", "--no-proxy-headers", "--no-server-header"]

# ---- web: nginx serving static files, passing PHP to the app and /api/ to the API -----
FROM nginxinc/nginx-unprivileged:1.31.6-alpine AS web
USER root
RUN apk upgrade --no-cache
COPY wordpress/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY wordpress/docker/admin-headers.conf wordpress/docker/fastcgi-wordpress.conf /etc/nginx/snippets/
COPY --from=app /var/www/html /var/www/html
COPY --from=fonts /build/out /var/www/html/fonts
COPY public/logo.png public/favicon.png public/apple-touch-icon.png public/robots.txt /var/www/html/
ARG VERSION=dev
# Uploads belong to www-data (82), as in the app image, whichever container mounts the volume first.
RUN echo "$VERSION" > /var/www/html/version.txt \
 && chown 82:82 /var/www/html/wp-content/uploads
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
