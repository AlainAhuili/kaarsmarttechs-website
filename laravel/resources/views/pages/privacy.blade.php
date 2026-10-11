{{-- TODO before launch: complete and have reviewed. Unlike the static site, this version has a
     contact form that stores messages and sets a session cookie on the contact page only. --}}
<x-layout
  title="Privacy policy"
  description="Privacy policy (Datenschutzerklärung) for Kaar Smart Techs."
>
  <section class="section">
    <div class="wrap prose">
      <h1>Privacy policy</h1>
      <p>
        This website uses no analytics and loads no content from third parties. Fonts are served
        from our own server. Cookies are set only on the contact page, as described below.
      </p>
      <h2>Controller</h2>
      <p>Kaar Smart Techs, [address], Delmenhorst, Germany. E-Mail: {{ config('site.contact_email') }}</p>
      <h2>Server log files</h2>
      <p>
        Our hosting provider [name, location] processes the IP address, time and requested page to
        deliver the site and keep it secure (Art. 6(1)(f) GDPR). Logs are deleted after [n] days.
      </p>
      <h2>Contact form</h2>
      <p>
        When you send the contact form, we store your name, email address, optional company name and
        message in our database to answer you (Art. 6(1)(b) GDPR). Messages are deleted automatically
        after {{ config('site.contact_retention_days') }} days, unless statutory retention periods apply.
      </p>
      <p>
        To protect the form against forged submissions and abuse, the contact page sets a session
        cookie and a security token cookie, which expire after
        {{ config('session.lifetime') }} minutes. They are strictly necessary for the form to work
        (§ 25(2) TDDDG) and are not used for tracking. Your IP address is used briefly to limit the
        number of messages per visitor and is not stored with your message.
      </p>
      <h2>Contact by email</h2>
      <p>
        When you email us, we process your message to answer it (Art. 6(1)(b) GDPR) and delete it
        when it is no longer needed, unless statutory retention periods apply.
      </p>
      <h2>Your rights</h2>
      <p>
        You have the right to access, rectification, erasure, restriction of processing, data
        portability and objection, and the right to lodge a complaint with a supervisory authority
        such as the Landesbeauftragte für den Datenschutz Niedersachsen.
      </p>
    </div>
  </section>
</x-layout>
