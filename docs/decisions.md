# Design decisions

Short architecture decision records (context, decision, consequence).

## 1. Static site generator (Astro) instead of a server-rendered app

The site is marketing content and a portfolio with no user accounts. Static HTML is faster,
cheaper and has a far smaller attack surface. Astro ships zero JavaScript by default; the only
script is the project filter. **Consequence:** dynamic features (a contact form, the future sorter
dashboard) will be separate services, not part of this image.

## 2. Containers on Kubernetes instead of S3 + CloudFront

S3 + CloudFront would be the cheapest way to host a static site. The container route was chosen
because the company's products (sorter backend, MCP connector) will run on the same EKS platform,
so the website proves the delivery pipeline and platform end to end. **Consequence:** higher running
cost; the Terraform and pipeline are reusable for the next services.

## 3. Continuous delivery with a manual production gate

Staging deploys automatically on every merge; production waits for an approval in the GitHub
`production` environment. For a newly launched company with legal pages still under review,
a human check before publishing is worth the small delay. **Consequence:** switching to continuous
deployment later only means removing the required reviewers.

## 4. Immutable images deployed by digest

Tags can be moved; digests cannot. Deploying `image@sha256:...` guarantees staging and production
run byte-identical artifacts. **Consequence:** rollbacks reuse the previous ReplicaSet with no rebuild.

## 5. GDPR by construction

Fonts are self-hosted (a German court ruled in 2022 that loading Google Fonts from Google's servers
without consent violated the GDPR), there is no analytics or cookie, hosting is in Frankfurt, and a
post-build test fails the pipeline if any page loads a third-party resource. **Consequence:** no
cookie banner is needed while this holds.

## 6. Strict Content Security Policy, enforced by tests

`script-src 'self'` blocks inline scripts. Astro inlines small scripts by default, which would have
silently broken the project filter in production, so the build emits all scripts as files and a
post-build test rejects inline scripts. Security headers live in one nginx snippet included in every
location, because nginx drops server-level `add_header` directives in any location that sets its
own; the smoke test checks the headers on the live site.

## 7. A second release artifact on Laravel, nginx and MySQL

The static site cannot accept input, and the company's next services need a database-backed web
stack. The Laravel version renders the same pages from MySQL and adds a contact form. Project
entries stay in `src/content/projects` and are synced into MySQL on every deployment, so both
artifacts always show the same portfolio. Content pages stay stateless: only `/contact/` starts a
session, so cookies are limited to the one page where they are strictly necessary. **Consequence:**
the privacy policy of this version must mention the form and its session cookie, and the database
needs backups once it holds real messages.
