@php
    // Animated conveyor: bricks pass the camera and are pushed into the bin for their colour.
    // With reduced motion, the bricks rest on the belt at their static positions.
    $bins = [
        ['x' => 330, 'label' => 'Vision', 'color' => 'var(--signal)'],
        ['x' => 560, 'label' => 'Embedded', 'color' => 'var(--teal)'],
        ['x' => 790, 'label' => 'Cloud', 'color' => 'var(--brick-blue)'],
    ];
    // static x on the belt, target bin index, animation delay (s)
    $bricks = [
        ['sx' => 40, 'bin' => 0, 'delay' => 0],
        ['sx' => 120, 'bin' => 2, 'delay' => 1.2],
        ['sx' => 200, 'bin' => 1, 'delay' => 2.4],
        ['sx' => 420, 'bin' => 0, 'delay' => 3.6],
        ['sx' => 650, 'bin' => 1, 'delay' => 4.8],
        ['sx' => 860, 'bin' => 2, 'delay' => 6],
    ];
@endphp
<figure class="sorter">
  <svg viewBox="0 0 1000 370" role="img" aria-labelledby="sorter-title">
    <title id="sorter-title">
      A conveyor carries coloured bricks past a camera, and each brick is pushed into the bin that
      matches its colour.
    </title>

    {{-- camera and scan beam --}}
    <polygon points="165,62 195,62 225,150 135,150" fill="var(--signal)" opacity="0.28"></polygon>
    <rect x="150" y="30" width="60" height="34" fill="var(--ink)"></rect>
    <circle cx="180" cy="47" r="9" fill="var(--paper)"></circle>
    <circle cx="180" cy="47" r="4" fill="var(--ink)"></circle>
    <line x1="180" y1="0" x2="180" y2="30" stroke="var(--ink)" stroke-width="4"></line>

    {{-- ejectors --}}
    @foreach ($bins as $b)
      <g>
        <line x1="{{ $b['x'] }}" y1="70" x2="{{ $b['x'] }}" y2="104" stroke="var(--steel)" stroke-width="4"></line>
        <rect x="{{ $b['x'] - 14 }}" y="104" width="28" height="12" fill="var(--steel)"></rect>
      </g>
    @endforeach

    {{-- belt --}}
    <rect x="0" y="156" width="1000" height="16" fill="var(--ink)"></rect>
    <g class="belt-marks" fill="var(--signal)">
      @for ($i = 0; $i < 27; $i++)
        <rect x="{{ $i * 40 - 40 }}" y="162" width="18" height="4"></rect>
      @endfor
    </g>
    @for ($i = 0; $i < 11; $i++)
      <circle cx="{{ 20 + $i * 96 }}" cy="184" r="10" fill="none" stroke="var(--steel)" stroke-width="3"></circle>
    @endfor

    {{-- bins --}}
    @foreach ($bins as $b)
      <g>
        <path
          d="M{{ $b['x'] - 70 }} 240 L{{ $b['x'] - 58 }} 320 L{{ $b['x'] + 58 }} 320 L{{ $b['x'] + 70 }} 240"
          fill="var(--panel)"
          stroke="var(--ink)"
          stroke-width="3"
        ></path>
        <rect x="{{ $b['x'] - 58 }}" y="312" width="116" height="8" fill="{{ $b['color'] }}"></rect>
        <text x="{{ $b['x'] }}" y="352" text-anchor="middle" class="bin-label">{{ $b['label'] }}</text>
      </g>
    @endforeach

    {{-- bricks --}}
    @foreach ($bricks as $k)
      @php($target = $bins[$k['bin']])
      <g
        class="brick"
        transform="translate({{ $k['sx'] }} 124)"
        style="--x:{{ $target['x'] - 24 }}px; animation-delay:{{ $k['delay'] }}s"
      >
        <rect x="0" y="8" width="48" height="24" fill="{{ $target['color'] }}"></rect>
        <rect x="7" y="2" width="12" height="6" fill="{{ $target['color'] }}"></rect>
        <rect x="29" y="2" width="12" height="6" fill="{{ $target['color'] }}"></rect>
      </g>
    @endforeach
  </svg>
</figure>
