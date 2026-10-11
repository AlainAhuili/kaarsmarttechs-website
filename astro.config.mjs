import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://kaarsmarttechs.com",
  trailingSlash: "ignore",
  build: { format: "directory" },
  // Emit every script as a file so the strict CSP (script-src 'self') in docker/nginx.conf holds.
  vite: { build: { assetsInlineLimit: 0 } },
});
