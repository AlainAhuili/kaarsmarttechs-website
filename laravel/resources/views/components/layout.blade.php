@props(['title', 'description'])
@php
    $site = config('site.name');
    $fullTitle = $title === $site ? $title : "{$title} | {$site}";
    $path = request()->getPathInfo();
    $canonical = rtrim(config('app.url'), '/').($path === '/' ? '/' : rtrim($path, '/').'/');
@endphp
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $fullTitle }}</title>
    <meta name="description" content="{{ $description }}">
    <link rel="canonical" href="{{ $canonical }}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <meta property="og:title" content="{{ $fullTitle }}">
    <meta property="og:description" content="{{ $description }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $canonical }}">
    <meta name="theme-color" content="#15202e">
    {{-- Fonts are self-hosted (GDPR): copied into the image from the @fontsource packages. --}}
    <link rel="stylesheet" href="/fonts/archivo/wdth.css">
    <link rel="stylesheet" href="/fonts/ibm-plex-sans/400.css">
    <link rel="stylesheet" href="/fonts/ibm-plex-sans/500.css">
    <link rel="stylesheet" href="/css/site.css">
    {{ $head ?? '' }}
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <x-site-header />
    <main id="main">
      {{ $slot }}
    </main>
    <x-site-footer />
  </body>
</html>
