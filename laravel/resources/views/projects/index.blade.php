<x-layout
  title="Projects"
  description="Projects by Kaar Smart Techs in computer vision, embedded systems, cloud and DevOps, and agentic tooling."
>
  <x-slot:head>
    <script src="/js/projects-filter.js" defer></script>
  </x-slot>

  <section class="section">
    <div class="wrap">
      <h1>Projects</h1>
      <p class="lead">
        What we are building, with an honest status on each one. Results are published once they are
        measured.
      </p>

      <div class="filters" role="group" aria-label="Filter projects by category">
        <button type="button" data-filter="all" aria-pressed="true">All</button>
        @foreach ($categories as $category)
          <button type="button" data-filter="{{ \App\Models\Project::categorySlug($category) }}" aria-pressed="false">{{ $category }}</button>
        @endforeach
      </div>
      <p class="count" aria-live="polite" id="count">{{ $projects->count() }} {{ Str::plural('project', $projects->count()) }}</p>

      <ul class="rows bordered" id="project-list">
        @foreach ($projects as $project)
          <x-project-row :project="$project" />
        @endforeach
      </ul>
    </div>
  </section>
</x-layout>
