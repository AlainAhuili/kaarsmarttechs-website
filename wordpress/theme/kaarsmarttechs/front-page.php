<?php
defined('ABSPATH') || exit;

$projects = kaar_projects()['projects'];
$flagship = current(array_filter($projects, fn ($p) => $p['flagship'])) ?: ($projects[0] ?? null);
$others = array_slice(array_values(array_filter($projects, fn ($p) => ! $p['flagship'])), 0, 3);
$disciplines = [
    'Computer vision' => 'Cameras and OpenCV pipelines that identify, measure and count objects in real time.',
    'Embedded systems' => 'Low-level C++ that drives sensors and actuators reliably on small hardware.',
    'Cloud and DevOps' => 'Terraform, Docker, Kubernetes and AWS, delivered through automated pipelines.',
    'Agentic tooling' => 'Model Context Protocol integrations that let AI assistants work with your systems.',
];

kaar_layout_open(
    KAAR_SITE_NAME,
    'Kaar Smart Techs builds computer vision, embedded and cloud systems that work in the physical world. Based in Delmenhorst, Germany.',
);
?>
      <section class="hero">
        <div class="wrap">
          <h1>We build machines that see and sort.</h1>
          <p class="lead">
            Computer vision, embedded software and cloud infrastructure, engineered as one system. From
            Delmenhorst, Germany.
          </p>
        </div>
        <div class="wrap line">
<?php kaar_sorter_line(); ?>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <h2>What we work on</h2>
          <ul class="disciplines">
<?php foreach ($disciplines as $name => $text) { ?>
            <li>
              <h3><?= esc_html($name) ?></h3>
              <p><?= esc_html($text) ?></p>
            </li>
<?php } ?>
          </ul>
        </div>
      </section>

<?php if ($flagship) { ?>
      <section class="section flagship">
        <div class="wrap split">
          <div>
            <h2><?= esc_html($flagship['title']) ?></h2>
            <p class="lead"><?= esc_html($flagship['tagline']) ?></p>
            <p><?= esc_html($flagship['problem']) ?></p>
            <a class="button" href="/projects/<?= esc_attr($flagship['slug']) ?>/">Read the case study</a>
          </div>
          <dl class="facts">
            <div>
              <dt>Status</dt>
              <dd><?= esc_html($flagship['status']) ?></dd>
            </div>
            <div>
              <dt>Built with</dt>
              <dd><?= esc_html(implode(', ', $flagship['stack'])) ?></dd>
            </div>
          </dl>
        </div>
      </section>
<?php } ?>

      <section class="section">
        <div class="wrap">
          <h2>More projects</h2>
          <ul class="rows">
<?php foreach ($others as $project) {
    kaar_project_row($project);
} ?>
          </ul>
          <p><a href="/projects/">See all projects</a></p>
        </div>
      </section>

      <section class="section cta">
        <div class="wrap">
          <h2>Have a machine that needs to see?</h2>
          <p class="lead">Tell us what you want to detect, sort or automate.</p>
          <a class="button" href="/contact/">Start a conversation</a>
        </div>
      </section>
<?php
kaar_layout_close();
