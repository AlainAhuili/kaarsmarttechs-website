<x-layout :title="$project->title" :description="$project->tagline">
  <article class="section project">
    <div class="wrap">
      <p class="crumb"><a href="/projects/">Projects</a></p>
      <h1>{{ $project->title }}</h1>
      <p class="lead">{{ $project->tagline }}</p>

      <dl class="facts">
        <div>
          <dt>Status</dt>
          <dd>{{ $project->status }}</dd>
        </div>
        <div>
          <dt>Categories</dt>
          <dd>{{ implode(', ', $project->categories) }}</dd>
        </div>
        <div>
          <dt>Built with</dt>
          <dd>{{ implode(', ', $project->stack) }}</dd>
        </div>
      </dl>

      <div class="prose">
        <h2>The problem</h2>
        <p>{{ $project->problem }}</p>
        {!! $project->bodyHtml() !!}
      </div>

      @if (count($project->metrics) > 0)
        <section class="metrics" aria-labelledby="results">
          <h2 id="results">Results</h2>
          <p>We publish measured numbers only. Open values are still being measured.</p>
          <dl>
            @foreach ($project->metrics as $metric)
              <div @class(['pending' => blank($metric['value'])])>
                <dt>{{ $metric['label'] }}</dt>
                <dd>{{ filled($metric['value']) ? $metric['value'] : 'Measuring' }}</dd>
              </div>
            @endforeach
          </dl>
        </section>
      @endif

      <p class="next">
        <a class="button" href="/contact/">Talk to us about a similar project</a>
      </p>
    </div>
  </article>
</x-layout>
