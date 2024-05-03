<template>
  <span>
    <span>
      {{ content.currentItem.url?.hostname }}
    </span>
    <span
      v-if="content.currentItem.url?.pathname !== '/'"
      class="text-gray-500"
    >
      {{ content.currentItem.url?.pathname }}
    </span>
  </span>
  <BaseButton
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
  window.open(content.currentItem.url?.href, '_blank');
}
</script>
