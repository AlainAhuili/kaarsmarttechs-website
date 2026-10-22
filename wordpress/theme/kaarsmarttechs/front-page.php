<?php
defined('ABSPATH') || exit;

$projects = kaar_projects()['projects'];
$flagship = current(array_filter($projects, fn ($p) => $p['flagship'])) ?: ($projects[0] ?? null);
$others = array_slice(array_values(array_filter($projects, fn ($p) => ! $p['flagship'])), 0, 3);
$disciplines = [
    'Vision and inspection systems' => 'Low-latency OpenCV pipelines, camera setups and custom classification models for real-time work such as high-speed part sorting and 3D precision welding robotics.',
    'Embedded and systems engineering' => 'Lightweight, energy-efficient C++ and C# software running directly on constrained targets (NPU, Jetson and specialised microcontrollers) for predictable real-time performance.',
    'Agentic AI and MCP integrations' => 'Secure Model Context Protocol servers connecting AI assistants, RAG diagnostic tools and local equipment, without compromising your IP or network autonomy.',
    'Hybrid cloud and delivery pipelines' => 'Enterprise-grade cloud architecture with Terraform, Kubernetes and AWS, and continuous integration with strict code-quality gates.',
];
$advantages = [
    '100% on-device autonomy' => 'No dependency on a constant internet connection, so critical industrial machinery keeps running reliably through network disruptions.',
    'Turnkey engineering' => 'Full-lifecycle delivery, from quantised model deployment and hardware optimisation to audit-ready codebases.',
];

kaar_layout_open(
    KAAR_SITE_NAME,
    'Kaar Smart Techs bridges software and hardware with Edge AI, embedded systems and robust cloud infrastructure. Based in Delmenhorst, Germany.',
);
?>
      <section class="hero">
        <div class="wrap">
          <h1>We bring AI to the edge, where machines run.</h1>
          <p class="lead">
            High-performance software bridged with hardware through Edge AI, embedded systems and robust
            cloud infrastructure. Processing data where machines and sensors operate removes cloud
            latency, cuts infrastructure costs and keeps your data secure. From Delmenhorst, Germany.
          </p>
        </div>
        <div class="wrap line">
<?php kaar_sorter_line(); ?>
        </div>
      </section>

      <section class="section">
        <div class="wrap">
          <h2>Key technical pillars</h2>
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

      <section class="section">
        <div class="wrap">
          <h2>Strategic advantage</h2>
          <dl class="services">
<?php foreach ($advantages as $name => $text) { ?>
            <div>
              <dt><?= esc_html($name) ?></dt>
              <dd><?= esc_html($text) ?></dd>
            </div>
<?php } ?>
          </dl>
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
