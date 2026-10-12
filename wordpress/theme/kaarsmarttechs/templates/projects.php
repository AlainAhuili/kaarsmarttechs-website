<?php
defined('ABSPATH') || exit;

['projects' => $projects, 'categories' => $categories] = kaar_projects();
$count = count($projects);

kaar_layout_open(
    'Projects',
    'Projects by Kaar Smart Techs in computer vision, embedded systems, cloud and DevOps, and agentic tooling.',
    ['projects-filter.js'],
);
?>
      <section class="section">
        <div class="wrap">
          <h1>Projects</h1>
          <p class="lead">
            What we are building, with an honest status on each one. Results are published once they are
            measured.
          </p>

          <div class="filters" role="group" aria-label="Filter projects by category">
            <button type="button" data-filter="all" aria-pressed="true">All</button>
<?php foreach ($categories as $category) { ?>
            <button type="button" data-filter="<?= esc_attr(kaar_category_slug($category)) ?>" aria-pressed="false"><?= esc_html($category) ?></button>
<?php } ?>
          </div>
          <p class="count" aria-live="polite" id="count"><?= esc_html($count.' '.($count === 1 ? 'project' : 'projects')) ?></p>

          <ul class="rows bordered" id="project-list">
<?php foreach ($projects as $project) {
    kaar_project_row($project);
} ?>
          </ul>
        </div>
      </section>
<?php
kaar_layout_close();
