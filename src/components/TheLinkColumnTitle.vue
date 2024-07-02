<template>
  <span class="select-text truncate text-secondary-color">
    <span class="text-primary-color">
      {{ content.currentPostItem?.url?.hostname }}
    </span>
    <span>
      {{ content.currentPostItem?.url?.pathname }}{{ content.currentPostItem?.url?.search }}
    </span>
  </span>
  <BaseButton
    v-show="content.currentPostItem"
    icon="external"
    small
    title="Open in External Tab"
    @click="openInExternalTab()"
  />
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

function openInExternalTab() {
  window.open(content.currentPostItem?.url?.href, '_blank');
}
</script>
