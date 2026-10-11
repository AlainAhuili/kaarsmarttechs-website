@php
    $disciplines = [
        ['name' => 'Computer vision', 'text' => 'Cameras and OpenCV pipelines that identify, measure and count objects in real time.'],
        ['name' => 'Embedded systems', 'text' => 'Low-level C++ that drives sensors and actuators reliably on small hardware.'],
        ['name' => 'Cloud and DevOps', 'text' => 'Terraform, Docker, Kubernetes and AWS, delivered through automated pipelines.'],
        ['name' => 'Agentic tooling', 'text' => 'Model Context Protocol integrations that let AI assistants work with your systems.'],
    ];
@endphp
<x-layout
  title="Kaar Smart Techs"
  description="Kaar Smart Techs builds computer vision, embedded and cloud systems that work in the physical world. Based in Delmenhorst, Germany."
>
  <section class="hero">
    <div class="wrap">
      <h1>We build machines that see and sort.</h1>
      <p class="lead">
        Computer vision, embedded software and cloud infrastructure, engineered as one system. From
        Delmenhorst, Germany.
      </p>
    </div>
    <div class="wrap line">
      <x-sorter-line />
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>What we work on</h2>
      <ul class="disciplines">
        @foreach ($disciplines as $d)
          <li>
            <h3>{{ $d['name'] }}</h3>
            <p>{{ $d['text'] }}</p>
          </li>
        @endforeach
      </ul>
    </div>
  </section>

  @if ($flagship)
    <section class="section flagship">
      <div class="wrap split">
        <div>
          <h2>{{ $flagship->title }}</h2>
          <p class="lead">{{ $flagship->tagline }}</p>
          <p>{{ $flagship->problem }}</p>
          <a class="button" href="/projects/{{ $flagship->slug }}/">Read the case study</a>
        </div>
        <dl class="facts">
          <div>
            <dt>Status</dt>
            <dd>{{ $flagship->status }}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{{ implode(', ', $flagship->stack) }}</dd>
          </div>
        </dl>
      </div>
    </section>
  @endif

  <section class="section">
    <div class="wrap">
      <h2>More projects</h2>
      <ul class="rows">
        @foreach ($others as $project)
          <x-project-row :project="$project" />
        @endforeach
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
</x-layout>
