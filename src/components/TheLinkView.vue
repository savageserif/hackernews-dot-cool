<template>
  <PageColumnBody>
    <object
      v-if="rendered"
      v-show="!error"
      ref="objectElement"
      class="h-full w-full"
      :data="content.currentPostItem?.url?.href"
    />
    <div
      v-show="error"
      class="flex h-full flex-col items-center justify-center gap-4 bg-gray-100"
    >
      <div class="max-w-150 text-balance px-8 text-center leading-paragraph-narrow text-gray-500">
        Unfortunately, this website does not allow an inline preview. You can open the link
        externally instead.
      </div>
      <BaseButton
        icon="external"
        bordered
        @click="openExternalLink()"
      >
        Open in External Tab
      </BaseButton>
    </div>
  </PageColumnBody>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useEventListener } from '@vueuse/core';
import BaseButton from '@/components/BaseButton.vue';
import { useContentStore } from '@/stores/ContentStore';
import PageColumnBody from './PageColumnBody.vue';

const content = useContentStore();

const rendered = ref(true);
const error = ref(false);

watch(
  () => content.currentPostItem,
  async () => {
    // force object element to be replaced when current post item changes
    // (object element seems to refuse to load new content once an error has occurred)
    rendered.value = false;
    await nextTick();
    rendered.value = true;
    await nextTick();

    error.value = false;
  }
);

const objectElement = ref<Element | null>(null);

useEventListener(objectElement, 'error', () => {
  error.value = true;
});

function openExternalLink() {
  window.open(content.currentPostItem?.url?.href, '_blank');
}
</script>
