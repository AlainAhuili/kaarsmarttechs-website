<?php
// Served with status 503 when the projects API is unreachable and nothing is cached.
// Self-contained on purpose: rendering must not depend on the API or the database.
defined('ABSPATH') || exit;
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Something went wrong | Kaar Smart Techs</title>
    <meta name="description" content="A temporary error occurred.">
    <link rel="stylesheet" href="<?= esc_attr(kaar_asset('site.css')) ?>">
  </head>
  <body>
    <main id="main" class="section">
      <div class="wrap">
        <h1>The line stopped.</h1>
        <p class="lead">Something went wrong on our side. Please try again in a minute.</p>
        <p><a class="button" href="/">Go to the homepage</a></p>
      </div>
    </main>
  </body>
</html>
