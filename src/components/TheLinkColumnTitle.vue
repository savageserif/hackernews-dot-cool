<template>
  <span class="select-text">
    <span>
      {{ content.currentPostItem?.url?.hostname }}
    </span>
    <span
      v-if="content.currentPostItem?.url?.pathname !== '/'"
      class="text-secondary-color"
    >
      {{ content.currentPostItem?.url?.pathname }}{{ content.currentPostItem?.url?.search }}
    </span>
  </span>
  <BaseButton
    v-show="content.currentPostItem"
    icon="external"
    small
    title="Open in External Tab"
    @click="openExternalLink()"
  />
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

function openExternalLink() {
  window.open(content.currentPostItem?.url?.href, '_blank');
}
</script>
