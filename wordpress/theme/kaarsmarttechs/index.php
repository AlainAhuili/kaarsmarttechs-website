<?php
// Required by WordPress. Every request is routed in inc/routes.php, so this only renders if a
// plugin bypasses the routing: treat it as not found.
defined('ABSPATH') || exit;

require __DIR__.'/404.php';
