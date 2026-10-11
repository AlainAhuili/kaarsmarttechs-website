<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    private function validMessage(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Ada Example',
            'email' => 'ada@example.com',
            'company' => 'Example GmbH',
            'message' => 'We need a camera that counts parts on our line.',
        ], $overrides);
    }

    public function test_valid_message_is_stored_and_confirmed(): void
    {
        $this->post('/contact/', $this->validMessage())
            ->assertRedirect('/contact/')
            ->assertSessionHas('sent', true);

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'ada@example.com',
            'company' => 'Example GmbH',
        ]);
    }

    public function test_confirmation_replaces_the_form_after_sending(): void
    {
        $this->withSession(['sent' => true])
            ->get('/contact/')
            ->assertSee('Your message has been sent')
            ->assertDontSee('<form', false);
    }

    public function test_company_is_optional(): void
    {
        $this->post('/contact/', $this->validMessage(['company' => '']))->assertSessionHasNoErrors();

        $this->assertDatabaseHas('contact_messages', ['email' => 'ada@example.com', 'company' => null]);
    }

    public function test_invalid_message_is_rejected_with_field_errors(): void
    {
        $this->from('/contact/')
            ->post('/contact/', ['name' => '', 'email' => 'not-an-email', 'message' => 'short'])
            ->assertRedirect('/contact/')
            ->assertSessionHasErrors(['name', 'email', 'message']);

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_honeypot_submission_is_answered_but_not_stored(): void
    {
        $this->post('/contact/', $this->validMessage(['website' => 'https://spam.example']))
            ->assertRedirect('/contact/');

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_submissions_are_rate_limited_per_visitor(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->post('/contact/', $this->validMessage())->assertRedirect('/contact/');
        }

        $this->post('/contact/', $this->validMessage())->assertTooManyRequests();
        $this->assertDatabaseCount('contact_messages', 3);
    }

    public function test_messages_older_than_the_retention_period_are_pruned(): void
    {
        $days = config('site.contact_retention_days');
        $old = ContactMessage::create($this->validMessage());
        $old->forceFill(['created_at' => now()->subDays($days + 1)])->save();
        $recent = ContactMessage::create($this->validMessage(['email' => 'recent@example.com']));

        $this->artisan('model:prune', ['--model' => [ContactMessage::class]])->assertSuccessful();

        $this->assertModelMissing($old);
        $this->assertModelExists($recent);
    }
}
