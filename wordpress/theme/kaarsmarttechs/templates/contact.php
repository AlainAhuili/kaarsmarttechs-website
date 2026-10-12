<?php
/**
 * The form posts to the FastAPI service (/api/contact), which redirects back here with the outcome
 * in the query string: ?sent=1, or ?error=invalid&fields=name,email, ?error=rate-limited.
 * No session or cookie is needed.
 */
defined('ABSPATH') || exit;

$sent = isset($_GET['sent']);
$error = sanitize_key($_GET['error'] ?? '');
$invalid = array_map('sanitize_key', explode(',', (string) ($_GET['fields'] ?? '')));
$messages = [
    'name' => 'Please enter your name (up to 100 characters).',
    'email' => 'Please enter a valid email address.',
    'company' => 'Please shorten the company name to 100 characters.',
    'message' => 'Please write between 10 and 5000 characters.',
];
// field, label, input type, autocomplete token, required
$fields = [
    ['name', 'Name', 'text', 'name', true],
    ['email', 'Email', 'email', 'email', true],
    ['company', 'Company (optional)', 'text', 'organization', false],
];

/** aria attributes and error text for a field the API rejected. */
$field_error = function (string $field) use ($invalid, $messages): array {
    if (! in_array($field, $invalid, true)) {
        return ['', ''];
    }

    return [
        sprintf(' aria-invalid="true" aria-describedby="%s-error"', $field),
        sprintf('<p class="field-error" id="%s-error">%s</p>', $field, esc_html($messages[$field])),
    ];
};

kaar_layout_open('Contact', 'Contact Kaar Smart Techs in Delmenhorst, Germany.');
?>
      <section class="section">
        <div class="wrap contact">
          <div>
            <h1>Contact</h1>
            <p class="lead">
              Describe what you want to detect, sort or automate, and roughly when you need it. We reply
              within two working days.
            </p>

<?php if ($sent) { ?>
            <p class="notice" role="status" id="contact-form">Thank you. Your message has been sent, and we will reply by email.</p>
<?php } else { ?>
            <form class="contact-form" id="contact-form" method="post" action="/api/contact">
<?php if ($error === 'invalid') { ?>
              <p class="form-error" role="alert">Please correct the highlighted fields and send the message again.</p>
<?php } elseif ($error === 'rate-limited') { ?>
              <p class="form-error" role="alert">Too many messages from your connection. Please try again later or send us an email.</p>
<?php } elseif ($error !== '') { ?>
              <p class="form-error" role="alert">The message could not be sent. Please try again or send us an email.</p>
<?php } ?>

<?php foreach ($fields as [$field, $label, $type, $autocomplete, $required]) {
    [$aria, $hint] = $field_error($field); ?>
              <div class="field">
                <label for="<?= $field ?>"><?= esc_html($label) ?></label>
                <input id="<?= $field ?>" name="<?= $field ?>" type="<?= $type ?>" autocomplete="<?= $autocomplete ?>"<?= $required ? ' required' : '' ?> maxlength="<?= $field === 'email' ? 254 : 100 ?>"<?= $aria ?>>
                <?= $hint ?>
              </div>
<?php } ?>

<?php [$aria, $hint] = $field_error('message'); ?>
              <div class="field">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="7" required minlength="10" maxlength="5000"<?= $aria ?>></textarea>
                <?= $hint ?>
              </div>

              <!-- Honeypot: hidden from people and assistive technology, filled in by bots. -->
              <div class="hp" aria-hidden="true">
                <label for="website">Leave this field empty</label>
                <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
              </div>

              <p class="fine-print">
                We use your details only to answer your message and delete them after
                <?= (int) KAAR_CONTACT_RETENTION_DAYS ?> days. See the <a href="/datenschutz/">privacy policy</a>.
              </p>
              <button class="button" type="submit">Send message</button>
            </form>
<?php } ?>
          </div>

          <div class="contact-direct">
            <h2>Prefer email?</h2>
            <p><a href="mailto:<?= esc_attr(KAAR_CONTACT_EMAIL) ?>"><?= esc_html(KAAR_CONTACT_EMAIL) ?></a></p>
            <p>
              Kaar Smart Techs
              <br>
              Delmenhorst, Lower Saxony, Germany
            </p>
          </div>
        </div>
      </section>
<?php
kaar_layout_close();
