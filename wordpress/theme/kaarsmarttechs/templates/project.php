<?php
defined('ABSPATH') || exit;

$project = kaar_project((string) get_query_var('kaar_project'));

kaar_layout_open($project['title'], $project['tagline']);
?>
      <article class="section project">
        <div class="wrap">
          <p class="crumb"><a href="/projects/">Projects</a></p>
          <h1><?= esc_html($project['title']) ?></h1>
          <p class="lead"><?= esc_html($project['tagline']) ?></p>

          <dl class="facts">
            <div>
              <dt>Status</dt>
              <dd><?= esc_html($project['status']) ?></dd>
            </div>
            <div>
              <dt>Categories</dt>
              <dd><?= esc_html(implode(', ', $project['categories'])) ?></dd>
            </div>
            <div>
              <dt>Built with</dt>
              <dd><?= esc_html(implode(', ', $project['stack'])) ?></dd>
            </div>
          </dl>

          <div class="prose">
            <h2>The problem</h2>
            <p><?= esc_html($project['problem']) ?></p>
<?php // Rendered by the API with raw HTML escaped; filtered again here as defence in depth.
echo wp_kses_post($project['body_html']); ?>
          </div>

<?php if ($project['metrics']) { ?>
          <section class="metrics" aria-labelledby="results">
            <h2 id="results">Results</h2>
            <p>We publish measured numbers only. Open values are still being measured.</p>
            <dl>
<?php foreach ($project['metrics'] as $metric) {
    $measured = ($metric['value'] ?? '') !== ''; ?>
              <div<?= $measured ? '' : ' class="pending"' ?>>
                <dt><?= esc_html($metric['label']) ?></dt>
                <dd><?= esc_html($measured ? $metric['value'] : 'Measuring') ?></dd>
              </div>
<?php } ?>
            </dl>
          </section>
<?php } ?>

          <p class="next">
            <a class="button" href="/contact/">Talk to us about a similar project</a>
          </p>
        </div>
      </article>
<?php
kaar_layout_close();
