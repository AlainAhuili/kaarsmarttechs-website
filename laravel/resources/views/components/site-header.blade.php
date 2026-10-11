@php
    $links = [
        ['href' => '/projects/', 'label' => 'Projects', 'pattern' => 'projects*'],
        ['href' => '/services/', 'label' => 'Services', 'pattern' => 'services*'],
        ['href' => '/contact/', 'label' => 'Contact', 'pattern' => 'contact*'],
    ];
@endphp
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="/" aria-label="Kaar Smart Techs, home">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="1" y="9" width="26" height="18" fill="#15202e"></rect>
        <rect x="5" y="4" width="7" height="5" fill="#15202e"></rect>
        <rect x="16" y="4" width="7" height="5" fill="#f2b705"></rect>
      </svg>
      <span>Kaar Smart Techs</span>
    </a>
    <nav aria-label="Main">
      <ul>
        @foreach ($links as $link)
          <li>
            <a href="{{ $link['href'] }}" @if (request()->is($link['pattern'])) aria-current="page" @endif>{{ $link['label'] }}</a>
          </li>
        @endforeach
      </ul>
    </nav>
  </div>
</header>
