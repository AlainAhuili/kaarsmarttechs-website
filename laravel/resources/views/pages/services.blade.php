@php
    $services = [
        ['name' => 'Vision and inspection systems', 'text' => 'Camera setup, lighting, OpenCV pipelines and classification models for detecting, counting and sorting objects.'],
        ['name' => 'Embedded software', 'text' => 'C++ and C# software for controllers, sensors and actuators, built for reliability on constrained hardware.'],
        ['name' => 'Cloud platform and delivery pipelines', 'text' => 'Infrastructure as code with Terraform, containerised services on Kubernetes and AWS, and CI/CD with approval gates.'],
        ['name' => 'Code quality audits', 'text' => 'Static analysis and test gates for C++, Python and TypeScript repositories, set up and tuned for your codebase.'],
        ['name' => 'Agentic tooling and MCP integrations', 'text' => 'Model Context Protocol servers that connect AI assistants to your data and machines, with human confirmation where it matters.'],
    ];
@endphp
<x-layout
  title="Services"
  description="Engineering services from Kaar Smart Techs: vision systems, embedded software, cloud platforms, code quality audits and MCP integrations."
>
  <section class="section">
    <div class="wrap">
      <h1>Services</h1>
      <p class="lead">
        We take on projects where software meets hardware, or where delivery needs to be automated.
      </p>
      <dl class="services">
        @foreach ($services as $s)
          <div>
            <dt>{{ $s['name'] }}</dt>
            <dd>{{ $s['text'] }}</dd>
          </div>
        @endforeach
      </dl>
      <a class="button" href="/contact/">Discuss your project</a>
    </div>
  </section>
</x-layout>
