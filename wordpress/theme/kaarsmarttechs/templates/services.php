<?php
defined('ABSPATH') || exit;

$services = [
    'Vision and inspection systems' => 'Camera setup, lighting, OpenCV pipelines and classification models for detecting, counting and sorting objects.',
    'Embedded software' => 'C++ and C# software for controllers, sensors and actuators, built for reliability on constrained hardware.',
    'Cloud platform and delivery pipelines' => 'Infrastructure as code with Terraform, containerised services on Kubernetes and AWS, and CI/CD with approval gates.',
    'Code quality audits' => 'Static analysis and test gates for C++, Python and TypeScript repositories, set up and tuned for your codebase.',
    'Agentic tooling and MCP integrations' => 'Model Context Protocol servers that connect AI assistants to your data and machines, with human confirmation where it matters.',
];

kaar_layout_open(
    'Services',
    'Engineering services from Kaar Smart Techs: vision systems, embedded software, cloud platforms, code quality audits and MCP integrations.',
);
?>
      <section class="section">
        <div class="wrap">
          <h1>Services</h1>
          <p class="lead">
            We take on projects where software meets hardware, or where delivery needs to be automated.
          </p>
          <dl class="services">
<?php foreach ($services as $name => $text) { ?>
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
