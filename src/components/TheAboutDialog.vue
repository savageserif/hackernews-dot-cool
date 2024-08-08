<template>
  <BaseDialog
    id="about"
    title="About This Website"
  >
    <p class="!mt-1.5">
      <em class="font-serif text-base-serif !font-normal-serif">
        A project by
        <a
          href="https://simonlou.com/"
          target="_blank"
          >Simon</a
        >
        and
        <a
          href="https://jona.im/"
          target="_blank"
          >Jona</a
        >
      </em>
    </p>
    <p>
      This project is an attempt at rethinking the experience of browsing Hacker News by unifying
      the front page, linked websites and comments into a multi-column web app. Special attention
      has also been paid to improving typography and readability while keeping the information
      density high.
    </p>
    <p>
      We are interested to hear whether the interface complements your reading habits and affects
      your browsing experience — if you have any comments or suggestions, please reach out!
    </p>
    <p>
      The project’s source code is
      <a
        href="https://github.com/savageserif/hackernews-dot-cool"
        target="_blank"
        >available on GitHub</a
      >.
    </p>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue';
</script>
