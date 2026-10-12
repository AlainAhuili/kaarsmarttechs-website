<?php
/**
 * Pages edited in WordPress: the Impressum, the privacy policy and any page editors add. The
 * excerpt is the meta description.
 */
defined('ABSPATH') || exit;

the_post();
$description = get_the_excerpt() ?: get_the_title().' – '.KAAR_SITE_NAME;
kaar_layout_open(get_the_title(), wp_strip_all_tags($description));
?>
      <section class="section">
        <div class="wrap prose">
          <h1><?= esc_html(get_the_title()) ?></h1>
<?php the_content(); ?>
        </div>
      </section>
<?php
kaar_layout_close();
