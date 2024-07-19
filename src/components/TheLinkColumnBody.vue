<template>
  <PageColumnBody class="relative">
    <div
      class="flex h-full flex-col items-center justify-center gap-3 pb-4"
      :class="[showErrorMessage ? 'bg-controls-color' : '']"
    >
      <template v-if="showErrorMessage">
        <img
          :src="currentErrorAsset"
          class="size-32"
        />
        <div
          class="max-w-[28rem] text-balance px-8 text-center leading-paragraph-narrow text-secondary-color"
        >
          Unfortunately, this website does not {{ view.isSafari ? 'seem to' : '' }} allow an inline
          preview. You can open the link externally
          {{
            view.isSafari
              ? `by ${view.isTouchDevice ? 'tapping' : 'clicking'} the URL above`
              : 'instead'
          }}.
        </div>
        <BaseButton
          v-if="!view.isSafari"
          icon="external"
          bordered
          class="mt-1"
          @click="openInExternalTab()"
        >
          Open in External Tab
        </BaseButton>
      </template>
      <StatusItem
        v-else
        full-height
      />
    </div>
    <object
      v-if="renderObject"
      ref="objectElement"
      :data="content.currentPostItem?.url?.href"
      class="absolute inset-0 h-full w-full"
    />
  </PageColumnBody>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useEventListener } from '@vueuse/core';
import BaseButton from '@/components/BaseButton.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import StatusItem from '@/components/StatusItem.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();
const content = useContentStore();

// array of post IDs for which loading error has occurred
const errorPostIds = ref<number[]>([]);

// whether loading the current post item has previously resulted in an error
const previousErrorForPostId = computed(() =>
  content.currentPostItem ? errorPostIds.value.includes(content.currentPostItem.id) : false
);

// Safari-specific timeout for showing error message (see comment below)
let safariErrorMessageTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

const showErrorMessage = ref(false);
const renderObject = ref(true);

watch(
  () => content.currentPostItem,
  async () => {
    // if error is already apparent, remove object element and show error message immediately
    if (previousErrorForPostId.value) {
      renderObject.value = false;
      showErrorMessage.value = true;
      return;
    }

    // force object element to re-render (as seems to refuse to load new content once it has encountered an error)
    renderObject.value = false;
    await nextTick();
    renderObject.value = true;
    await nextTick();

    // hide error message
    showErrorMessage.value = false;

    // as the object element does not ever fire an error event on Safari, show the error message after a timeout there instead
    if (view.isSafari) {
      clearTimeout(safariErrorMessageTimeout);

      safariErrorMessageTimeout = setTimeout(() => {
        showErrorMessage.value = true;
      }, 4000);
    }
  },
  { immediate: true }
);

const objectElement = ref<HTMLElement | null>(null);

// on browsers other than Safari, listen for error events on the object element to show the error message
if (!view.isSafari) {
  useEventListener(objectElement, 'error', () => {
    // remove object element and show error message
    renderObject.value = false;
    showErrorMessage.value = true;

    // push ID of unloadable post to errorPostIds array
    if (content.currentPostItem && !errorPostIds.value.includes(content.currentPostItem.id)) {
      errorPostIds.value.push(content.currentPostItem.id);
    }
  });
}

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
