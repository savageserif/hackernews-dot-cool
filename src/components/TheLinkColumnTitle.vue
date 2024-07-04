<template>
  <BaseButton
    v-show="content.currentPostItem"
    icon="external"
    small
    reversed
    title="Open in External Tab"
    class="w-full"
    @click="openInExternalTab()"
  >
    <span class="truncate text-secondary-color">
      <span class="text-primary-color">
        {{ content.currentPostItem?.url?.hostname }}
      </span>
      <span>
        {{ content.currentPostItem?.url?.pathname }}{{ content.currentPostItem?.url?.search }}
      </span>
    </span>
  </BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

function openInExternalTab() {
  window.open(content.currentPostItem?.url?.href, '_blank');
}
</script>
