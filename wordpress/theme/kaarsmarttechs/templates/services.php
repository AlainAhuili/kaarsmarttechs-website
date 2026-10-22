<?php
defined('ABSPATH') || exit;

$services = [
    'Vision and inspection systems' => 'Low-latency OpenCV pipelines, camera setup and lighting, and custom classification models for real-time applications such as high-speed part sorting and 3D precision welding robotics.',
    'Embedded and systems engineering' => 'Lightweight, energy-efficient C++ and C# software running directly on constrained targets (NPU, Jetson and specialised microcontrollers) for predictable real-time performance.',
    'Agentic AI and MCP integrations' => 'Secure Model Context Protocol servers connecting AI assistants, RAG diagnostic tools and local equipment, with human confirmation where it matters and without compromising your IP or network autonomy.',
    'Hybrid cloud and delivery pipelines' => 'Enterprise-grade cloud architecture as code with Terraform, containerised services on Kubernetes and AWS, and continuous integration with approval gates.',
    'Code quality audits' => 'Static analysis and strict test gates for C++, Python and TypeScript repositories, set up and tuned for your codebase so it stays audit-ready.',
];
$advantages = [
    '100% on-device autonomy' => 'No dependency on a constant internet connection, so critical industrial machinery keeps running reliably through network disruptions.',
    'Turnkey engineering' => 'Full-lifecycle delivery, from quantised model deployment and hardware optimisation to audit-ready codebases.',
];

kaar_layout_open(
    'Services',
    'Engineering services from Kaar Smart Techs: Edge AI vision systems, embedded software, MCP integrations, hybrid cloud pipelines and code quality audits.',
);
?>
      <section class="section">
        <div class="wrap">
          <h1>Services</h1>
          <p class="lead">
            We bridge high-performance software with hardware. By processing data at the edge, right where
            machines and sensors operate, we remove cloud latency, cut infrastructure costs and keep your
            data on site.
          </p>
          <dl class="services">
<?php foreach ($services as $name => $text) { ?>
            <div>
              <dt><?= esc_html($name) ?></dt>
              <dd><?= esc_html($text) ?></dd>
            </div>
<?php } ?>
          </dl>
          <h2>Strategic advantage</h2>
          <dl class="services">
<?php foreach ($advantages as $name => $text) { ?>
            <div>
              <dt><?= esc_html($name) ?></dt>
              <dd><?= esc_html($text) ?></dd>
            </div>
<?php } ?>
          </dl>
          <a class="button" href="/contact/">Discuss your project</a>
        </div>
      </section>
<?php
kaar_layout_close();
