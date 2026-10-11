@php
    $email = config('site.contact_email');
    // field, label, input type, autocomplete token, required
    $fields = [
        ['name', 'Name', 'text', 'name', true],
        ['email', 'Email', 'email', 'email', true],
        ['company', 'Company (optional)', 'text', 'organization', false],
    ];
@endphp
<x-layout title="Contact" description="Contact Kaar Smart Techs in Delmenhorst, Germany.">
  <section class="section">
    <div class="wrap contact">
      <div>
        <h1>Contact</h1>
        <p class="lead">
          Describe what you want to detect, sort or automate, and roughly when you need it. We reply
          within two working days.
        </p>

        @if (session('sent'))
          <p class="notice" role="status">Thank you. Your message has been sent, and we will reply by email.</p>
        @else
          <form class="contact-form" method="post" action="/contact/" novalidate>
            @csrf
            @if ($errors->any())
              <p class="form-error" role="alert">Please correct the highlighted fields.</p>
            @endif

            @foreach ($fields as [$field, $label, $type, $autocomplete, $required])
              <div class="field">
                <label for="{{ $field }}">{{ $label }}</label>
                <input
                  id="{{ $field }}" name="{{ $field }}" type="{{ $type }}" value="{{ old($field) }}"
                  autocomplete="{{ $autocomplete }}" @required($required)
                  @error($field) aria-invalid="true" aria-describedby="{{ $field }}-error" @enderror
                >
                @error($field) <p class="field-error" id="{{ $field }}-error">{{ $message }}</p> @enderror
              </div>
            @endforeach

            <div class="field">
              <label for="message">Message</label>
              <textarea
                id="message" name="message" rows="7" required
                @error('message') aria-invalid="true" aria-describedby="message-error" @enderror
              >{{ old('message') }}</textarea>
              @error('message') <p class="field-error" id="message-error">{{ $message }}</p> @enderror
            </div>

            {{-- Honeypot: hidden from people and assistive technology, filled in by bots. --}}
            <div class="hp" aria-hidden="true">
              <label for="website">Leave this field empty</label>
              <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
            </div>

            <p class="fine-print">
              We use your details only to answer your message and delete them after
              {{ config('site.contact_retention_days') }} days. See the <a href="/datenschutz/">privacy policy</a>.
            </p>
            <button class="button" type="submit">Send message</button>
          </form>
        @endif
      </div>

      <div class="contact-direct">
        <h2>Prefer email?</h2>
        <p><a href="mailto:{{ $email }}">{{ $email }}</a></p>
        <p>
          Kaar Smart Techs
          <br>
          Delmenhorst, Lower Saxony, Germany
        </p>
      </div>
    </div>
  </section>
</x-layout>
