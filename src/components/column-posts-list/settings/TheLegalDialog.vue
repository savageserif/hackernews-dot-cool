<template>
  <BaseDialog
    id="legal"
    title="Legal Notice"
  >
    <h3>Impressum</h3>
    <p>Responsible regarding § 5 of the German Telemedia Act:</p>
    <blockquote class="leading-paragraph-narrow">
      {{ legalName }}<br />{{ legalStreet }}<br />{{ legalCity }}<br />
      <a href="mailto:contact@hackernews.cool">contact@hackernews.cool</a>
    </blockquote>
    <p>
      We are neither responsible for content fetched from the official
      <a
        href="https://github.com/hackernews/api"
        target="_blank"
      >
        Hacker News API</a
      >, which includes story titles and comments, nor for the contents of linked websites embedded
      within the page.
    </p>
    <h3>Privacy Policy</h3>
    <p>
      We do not collect any personal information from website visitors. We use TelemetryDeck to
      gather anonymized, aggregated statistics such as browser, operating system, device type,
      language, and country (approximated from the first three triplets of the IP address).
      TelemetryDeck operates without using cookies and does not collect any personal data. For more
      information, visit
      <a
        href="https://telemetrydeck.com/privacy"
        target="_blank"
      >
        TelemetryDeck’s privacy policy</a
      >. This website is hosted by Vercel, which may collect anonymized logs. For more details,
      visit
      <a
        href="https://vercel.com/legal/privacy-policy"
        target="_blank"
      >
        Vercel’s privacy policy</a
      >. Please contact us at
      <a href="mailto:contact@hackernews.cool">contact@hackernews.cool</a> if you have any
      questions.
    </p>
  </BaseDialog>
</template>

<script setup lang="ts">
const legalName = import.meta.env.VITE_LEGAL_NAME;
const legalStreet = import.meta.env.VITE_LEGAL_STREET;
const legalCity = import.meta.env.VITE_LEGAL_CITY;
</script>
