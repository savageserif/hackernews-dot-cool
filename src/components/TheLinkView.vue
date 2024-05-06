<template>
  <PageColumnBody>
    <object
      v-if="objectRendered"
      v-show="!error"
      ref="objectElement"
      class="h-full w-full"
      :data="content.currentPostItem?.url?.href"
    />
    <div
      v-show="error"
      class="flex h-full flex-col items-center justify-center gap-4 bg-gray-100"
      :class="[firstErrorForPostId ? 'animate-appear' : '']"
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
import { ref, computed, watch, nextTick } from 'vue';
import { useEventListener } from '@vueuse/core';
import BaseButton from '@/components/BaseButton.vue';
import { useContentStore } from '@/stores/ContentStore';
import PageColumnBody from './PageColumnBody.vue';

const content = useContentStore();

// array of post IDs for which loading error has occurred
const errorPostIds = ref<number[]>([]);

// whether loading the current post item results in an error
const error = computed(() =>
  content.currentPostItem ? errorPostIds.value.includes(content.currentPostItem.id) : false
);

// whether an error for a specific post ID has just occurred for the first time (relevant for fade-in of error message)
const firstErrorForPostId = ref(false);

// whether the object element is being rendered (see comment below)
const objectRendered = ref(true);

watch(
  () => content.currentPostItem,
  async () => {
    // if error is already apparent, skip replacing object element
    if (error.value) return;

    firstErrorForPostId.value = false;

    // force object element to be replaced when current post item changes
    // (object element seems to refuse to load new content once it encounters an error)
    objectRendered.value = false;
    await nextTick();
    objectRendered.value = true;
    await nextTick();
  }
);

const objectElement = ref<Element | null>(null);

useEventListener(objectElement, 'error', () => {
  // when an error occurs, push ID of unloadable post to errorPostIds array
  if (content.currentPostItem && !errorPostIds.value.includes(content.currentPostItem.id)) {
    errorPostIds.value.push(content.currentPostItem.id);
    firstErrorForPostId.value = true;
  }
});

function openExternalLink() {
  window.open(content.currentPostItem?.url?.href, '_blank');
}
</script>
