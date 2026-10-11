<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * The same quality gate as the Astro post-build tests (tests/dist/site.test.ts), run against
 * the rendered Laravel responses.
 */
class PagesTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true;

    public static function pages(): array
    {
        return [
            'home' => ['/'],
            'services' => ['/services/'],
            'projects' => ['/projects/'],
            'flagship case study' => ['/projects/lego-sorting-system/'],
            'contact' => ['/contact/'],
            'impressum' => ['/impressum/'],
            'privacy' => ['/datenschutz/'],
        ];
    }

    #[DataProvider('pages')]
    public function test_page_renders_with_title_description_and_one_h1(string $path): void
    {
        $html = $this->get($path)->assertOk()->getContent();

        $this->assertMatchesRegularExpression('/<html lang="en"/', $html);
        $this->assertMatchesRegularExpression('/<title>[^<]{5,}<\/title>/', $html);
        $this->assertMatchesRegularExpression('/<meta name="description" content="[^"]{30,}"/', $html);
        $this->assertSame(1, preg_match_all('/<h1[\s>]/', $html));
    }

    #[DataProvider('pages')]
    public function test_page_links_to_impressum_and_privacy_policy(string $path): void
    {
        $this->get($path)
            ->assertSee('href="/impressum/"', false)
            ->assertSee('href="/datenschutz/"', false);
    }

    #[DataProvider('pages')]
    public function test_page_has_no_broken_internal_links(string $path): void
    {
        preg_match_all('/href="(\/[^"#?]*)/', $this->get($path)->getContent(), $m);

        foreach (array_unique($m[1]) as $href) {
            if (str_starts_with($href, '/fonts/')) {
                continue; // copied into the web image at build time
            }
            if (pathinfo($href, PATHINFO_EXTENSION) !== '') {
                $this->assertFileExists(public_path($href), "Missing static file {$href} on {$path}");

                continue;
            }
            $this->assertSame(200, $this->get($href)->status(), "Broken link {$href} on {$path}");
        }
    }

    #[DataProvider('pages')]
    public function test_page_has_no_inline_scripts(string $path): void
    {
        $html = $this->get($path)->getContent();

        $this->assertSame(0, preg_match_all('/<script(?![^>]*\ssrc=)[^>]*>/', $html), 'Inline scripts are blocked by the CSP');
    }

    #[DataProvider('pages')]
    public function test_page_loads_no_third_party_resources(string $path): void
    {
        preg_match_all('/<(?:script|link|img|iframe)[^>]+(?:src|href)="(https?:\/\/[^"]+)"/', $this->get($path)->getContent(), $m);
        $external = array_filter($m[1], fn (string $url) => ! str_starts_with($url, config('app.url')));

        $this->assertSame([], array_values($external));
    }

    public function test_content_pages_set_no_cookies(): void
    {
        foreach (['/', '/services/', '/projects/', '/projects/lego-sorting-system/', '/impressum/', '/datenschutz/'] as $path) {
            $this->assertSame([], $this->get($path)->headers->getCookies(), "{$path} sets a cookie");
        }
    }

    public function test_unknown_page_returns_404_with_site_layout(): void
    {
        $this->get('/this-page-does-not-exist/')
            ->assertNotFound()
            ->assertSee('This page fell off the belt.');
    }
}
