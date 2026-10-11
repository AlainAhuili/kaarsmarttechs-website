@props(['project'])
<li class="project-row" data-categories="{{ $project->categorySlugs() }}">
  <div class="meta">
    <span class="status">{{ $project->status }}</span>
    <span class="cats">{{ implode(', ', $project->categories) }}</span>
  </div>
  <div class="body">
    <h3><a href="/projects/{{ $project->slug }}/">{{ $project->title }}</a></h3>
    <p>{{ $project->tagline }}</p>
    <p class="stack">Built with {{ implode(', ', array_slice($project->stack, 0, 5)) }}</p>
  </div>
</li>
