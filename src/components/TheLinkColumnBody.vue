<template>
  <PageColumnBody>
    <object
      v-if="renderObject"
      v-show="!error"
      ref="objectElement"
      class="h-full w-full"
      :data="content.currentPostItem?.url?.href"
    />
    <div
      v-show="error"
      class="flex h-full flex-col items-center justify-center gap-3 bg-controls-color pb-4"
      :class="[firstErrorForPostId ? 'animate-appear' : '']"
    >
      <img
        :src="currentErrorAsset"
        class="w-32"
      />
      <div
        class="max-w-150 text-balance px-8 text-center leading-paragraph-narrow text-secondary-color"
      >
        Unfortunately, this website does not allow an inline preview. You can open the link
        externally instead.
      </div>
      <BaseButton
        icon="external"
        bordered
        class="mt-1"
        @click="openInExternalTab()"
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
import PageColumnBody from '@/components/PageColumnBody.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();
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
const renderObject = ref(true);

watch(
  () => content.currentPostItem,
  async () => {
    // if error is already apparent, skip replacing object element
    if (error.value) return;

    firstErrorForPostId.value = false;

    // force object element to be replaced when current post item changes
    // (object element seems to refuse to load new content once it encounters an error)
    renderObject.value = false;
    await nextTick();
    renderObject.value = true;
    await nextTick();
  }
);

const objectElement = ref<HTMLElement | null>(null);

useEventListener(objectElement, 'error', () => {
  // when an error occurs, push ID of unloadable post to errorPostIds array
  if (content.currentPostItem && !errorPostIds.value.includes(content.currentPostItem.id)) {
    errorPostIds.value.push(content.currentPostItem.id);
    firstErrorForPostId.value = true;
  }
});

const maxErrorAssetIndex = 5;
const errorAssetIndexes = [...Array(maxErrorAssetIndex + 1).keys()];

let currentErrorAssetIndex = 0;
const currentErrorAsset = ref(undefined);

watch(
  () => [content.currentPostItem, view.darkColorSchemeIsActive],
  () => {
    const otherErrorAssetIndexes = errorAssetIndexes.filter(
      (asset) => asset !== currentErrorAssetIndex
    );
    currentErrorAssetIndex =
      otherErrorAssetIndexes[Math.floor(Math.random() * otherErrorAssetIndexes.length)];

    import(
      `@/assets/images/error-${currentErrorAssetIndex + (view.darkColorSchemeIsActive ? '.dark' : '')}.png`
    ).then((imported) => {
      currentErrorAsset.value = imported.default;
    });
  },
  { immediate: true }
);

function openInExternalTab() {
  window.open(content.currentPostItem?.url?.href, '_blank');
}
</script>
