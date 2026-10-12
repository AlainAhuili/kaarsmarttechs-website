<?php
/**
 * Page layout and the components shared by the templates (ported from the Astro components).
 */

defined('ABSPATH') || exit;

const KAAR_SITE_NAME = 'Kaar Smart Techs';

/** Root-relative URL of a theme asset, versioned with the release for cache busting. */
function kaar_asset(string $path): string
{
    return wp_make_link_relative(get_theme_file_uri('assets/'.$path)).'?v='.rawurlencode(KAAR_VERSION);
}

/** Request path, normalised to a trailing slash as in the canonical URLs. */
function kaar_path(): string
{
    $path = (string) wp_parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

    return $path === '/' || $path === '' ? '/' : rtrim($path, '/').'/';
}

/**
 * @param  list<string>  $scripts  theme scripts to load (files only: the CSP blocks inline scripts)
 */
function kaar_layout_open(string $title, string $description, array $scripts = []): void
{
    $full_title = $title === KAAR_SITE_NAME ? $title : $title.' | '.KAAR_SITE_NAME;
    $canonical = rtrim(home_url(), '/').kaar_path();
    ?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= esc_html($full_title) ?></title>
    <meta name="description" content="<?= esc_attr($description) ?>">
    <link rel="canonical" href="<?= esc_url($canonical) ?>">
    <link rel="icon" href="/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta property="og:title" content="<?= esc_attr($full_title) ?>">
    <meta property="og:description" content="<?= esc_attr($description) ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?= esc_url($canonical) ?>">
    <meta name="theme-color" content="#15202e">
    <!-- Fonts are self-hosted (GDPR): copied into the web image from the @fontsource packages. -->
    <link rel="stylesheet" href="/fonts/archivo/wdth.css">
    <link rel="stylesheet" href="/fonts/ibm-plex-sans/400.css">
    <link rel="stylesheet" href="/fonts/ibm-plex-sans/500.css">
    <link rel="stylesheet" href="<?= esc_attr(kaar_asset('site.css')) ?>">
<?php foreach ($scripts as $script) { ?>
    <script src="<?= esc_attr(kaar_asset($script)) ?>" defer></script>
<?php } ?>
<?php wp_head(); ?>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
<?php kaar_site_header(); ?>
    <main id="main">
<?php
}

function kaar_layout_close(): void
{
    ?>
    </main>
<?php kaar_site_footer(); ?>
<?php wp_footer(); ?>
  </body>
</html>
<?php
}

function kaar_site_header(): void
{
    $links = ['/projects/' => 'Projects', '/services/' => 'Services', '/contact/' => 'Contact'];
    ?>
    <header class="site-header">
      <div class="wrap bar">
        <a class="brand" href="/" aria-label="Kaar Smart Techs, home">
          <img src="/logo.png" width="38" height="32" alt="">
          <span>Kaar Smart Techs</span>
        </a>
        <nav aria-label="Main">
          <ul>
<?php foreach ($links as $href => $label) { ?>
            <li><a href="<?= esc_attr($href) ?>"<?= str_starts_with(kaar_path(), $href) ? ' aria-current="page"' : '' ?>><?= esc_html($label) ?></a></li>
<?php } ?>
          </ul>
        </nav>
      </div>
    </header>
<?php
}

function kaar_site_footer(): void
{
    ?>
    <footer class="site-footer">
      <div class="wrap cols">
        <div>
          <p class="name">Kaar Smart Techs</p>
          <p>
            Vision, embedded and cloud systems.
            <br>
            Delmenhorst, Germany
          </p>
        </div>
        <nav aria-label="Legal">
          <a href="/impressum/">Impressum</a>
          <a href="/datenschutz/">Privacy policy</a>
          <a href="/contact/">Contact</a>
        </nav>
      </div>
      <div class="wrap fine">
        <p>
          &copy; <?= esc_html(gmdate('Y')) ?> Kaar Smart Techs. LEGO&reg; is a trademark of the LEGO Group, which does not
          sponsor, authorise or endorse this website.
        </p>
      </div>
    </footer>
<?php
}

/** @param array<string, mixed> $project */
function kaar_project_row(array $project): void
{
    ?>
        <li class="project-row" data-categories="<?= esc_attr(implode(' ', $project['category_slugs'])) ?>">
          <div class="meta">
            <span class="status"><?= esc_html($project['status']) ?></span>
            <span class="cats"><?= esc_html(implode(', ', $project['categories'])) ?></span>
          </div>
          <div class="body">
            <h3><a href="/projects/<?= esc_attr($project['slug']) ?>/"><?= esc_html($project['title']) ?></a></h3>
            <p><?= esc_html($project['tagline']) ?></p>
            <p class="stack">Built with <?= esc_html(implode(', ', array_slice($project['stack'], 0, 5))) ?></p>
          </div>
        </li>
<?php
}

/** URL-safe tag used by the client-side filter, e.g. "Cloud & DevOps" -> "cloud-devops". */
function kaar_category_slug(string $category): string
{
    return trim((string) preg_replace('/[^a-z0-9]+/', '-', str_replace('&', ' ', strtolower($category))), '-');
}

/**
 * Animated conveyor: bricks pass the camera and are pushed into the bin for their colour. With
 * reduced motion, the bricks rest on the belt at their static positions.
 */
function kaar_sorter_line(): void
{
    $bins = [
        ['x' => 330, 'label' => 'Vision', 'color' => 'var(--signal)'],
        ['x' => 560, 'label' => 'Embedded', 'color' => 'var(--teal)'],
        ['x' => 790, 'label' => 'Cloud', 'color' => 'var(--brick-blue)'],
    ];
    // static x on the belt, target bin index, animation delay (s)
    $bricks = [[40, 0, 0], [120, 2, 1.2], [200, 1, 2.4], [420, 0, 3.6], [650, 1, 4.8], [860, 2, 6]];
    ?>
      <figure class="sorter">
        <svg viewBox="0 0 1000 370" role="img" aria-labelledby="sorter-title">
          <title id="sorter-title">
            A conveyor carries coloured bricks past a camera, and each brick is pushed into the bin that
            matches its colour.
          </title>

          <!-- camera and scan beam -->
          <polygon points="165,62 195,62 225,150 135,150" fill="var(--signal)" opacity="0.28"></polygon>
          <rect x="150" y="30" width="60" height="34" fill="var(--ink)"></rect>
          <circle cx="180" cy="47" r="9" fill="var(--paper)"></circle>
          <circle cx="180" cy="47" r="4" fill="var(--ink)"></circle>
          <line x1="180" y1="0" x2="180" y2="30" stroke="var(--ink)" stroke-width="4"></line>

          <!-- ejectors -->
<?php foreach ($bins as $b) { ?>
          <g>
            <line x1="<?= $b['x'] ?>" y1="70" x2="<?= $b['x'] ?>" y2="104" stroke="var(--steel)" stroke-width="4"></line>
            <rect x="<?= $b['x'] - 14 ?>" y="104" width="28" height="12" fill="var(--steel)"></rect>
          </g>
<?php } ?>

          <!-- belt -->
          <rect x="0" y="156" width="1000" height="16" fill="var(--ink)"></rect>
          <g class="belt-marks" fill="var(--signal)">
<?php for ($i = 0; $i < 27; $i++) { ?>
            <rect x="<?= $i * 40 - 40 ?>" y="162" width="18" height="4"></rect>
<?php } ?>
          </g>
<?php for ($i = 0; $i < 11; $i++) { ?>
          <circle cx="<?= 20 + $i * 96 ?>" cy="184" r="10" fill="none" stroke="var(--steel)" stroke-width="3"></circle>
<?php } ?>

          <!-- bins -->
<?php foreach ($bins as $b) { ?>
          <g>
            <path
              d="M<?= $b['x'] - 70 ?> 240 L<?= $b['x'] - 58 ?> 320 L<?= $b['x'] + 58 ?> 320 L<?= $b['x'] + 70 ?> 240"
              fill="var(--panel)"
              stroke="var(--ink)"
              stroke-width="3"
            ></path>
            <rect x="<?= $b['x'] - 58 ?>" y="312" width="116" height="8" fill="<?= $b['color'] ?>"></rect>
            <text x="<?= $b['x'] ?>" y="352" text-anchor="middle" class="bin-label"><?= $b['label'] ?></text>
          </g>
<?php } ?>

          <!-- bricks -->
<?php foreach ($bricks as [$sx, $bin, $delay]) {
    $target = $bins[$bin]; ?>
          <g
            class="brick"
            transform="translate(<?= $sx ?> 124)"
            style="--x:<?= $target['x'] - 24 ?>px; animation-delay:<?= $delay ?>s"
          >
            <rect x="0" y="8" width="48" height="24" fill="<?= $target['color'] ?>"></rect>
            <rect x="7" y="2" width="12" height="6" fill="<?= $target['color'] ?>"></rect>
            <rect x="29" y="2" width="12" height="6" fill="<?= $target['color'] ?>"></rect>
          </g>
<?php } ?>
        </svg>
      </figure>
<?php
}
