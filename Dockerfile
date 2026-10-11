# ---- build stage -------------------------------------------------------------
FROM node:22.11-alpine3.20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG SITE_URL=https://kaarsmarttechs.com
ENV SITE_URL=$SITE_URL
RUN npm run build
ARG VERSION=dev
RUN echo "$VERSION" > dist/version.txt

# ---- runtime stage: static files only, non-root nginx --------------------------
FROM nginxinc/nginx-unprivileged:1.31.6-alpine
ARG VERSION=dev
LABEL org.opencontainers.image.title="kaarsmarttechs-website" \
      org.opencontainers.image.source="https://github.com/kaarsmarttechs/website" \
      org.opencontainers.image.version=$VERSION
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
