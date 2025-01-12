<template>
  <PageColumnBody class="relative">
    <div
      class="flex h-full flex-col items-center justify-center gap-4"
      :class="[view.availableColumns === 3 && showErrorMessage ? 'bg-controls-color' : '']"
    >
      <template v-if="showErrorMessage">
        <div
          class="-mt-4 size-32 text-secondary-color opacity-30 dark:opacity-45"
          :style="{
            filter: !view.darkColorSchemeIsActive ? 'url(#indentation-shadows)' : undefined,
          }"
          v-html="errorFaces[currentErrorFaceKey]"
        />
        <div
          class="max-w-[28rem] text-balance px-8 text-center leading-paragraph-narrow text-secondary-color"
        >
          Unfortunately, this website does not
          {{ !view.objectErrorEventsSupported ? 'seem to' : '' }} allow an inline preview. You can
          open the link externally
          {{
            !view.objectErrorEventsSupported
              ? `by ${view.isTouchDevice ? 'tapping' : 'clicking'} the URL above`
              : 'instead'
          }}.
        </div>
        <BaseButton
          v-if="view.objectErrorEventsSupported"
          icon="external"
          bordered
          @click="openInExternalTab()"
        >
          Open in External Tab
        </BaseButton>
      </template>
      <BaseStatusIndicator
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
import errorFaces from '@/assets/error-faces';

const view = useViewStore();
const content = useContentStore();

// set of hostnames that have previously been unembeddable (object tag fired error event)
const unembeddableHostnames = new Set<string>();

// whether loading the current post item has previously resulted in an error or the post’s URL matches known error hostnames
const anticipatedErrorForCurrentPostId = computed(() => {
  if (!content.currentPostItem) return false;

  return (
    content.currentPostItem.url && unembeddableHostnames.has(content.currentPostItem.url.hostname)
  );
});

// Safari-specific timeout for showing error message (see comment below)
let errorMessageTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

const showErrorMessage = ref(false);
const renderObject = ref(true);

watch(
  () => content.currentPostItem,
  async () => {
    // if error is already apparent, remove object element and show error message immediately
    if (anticipatedErrorForCurrentPostId.value) {
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
    if (!view.objectErrorEventsSupported) {
      clearTimeout(errorMessageTimeout);

      errorMessageTimeout = setTimeout(() => {
        showErrorMessage.value = true;
      }, 4000);
    }
  },
  { immediate: true }
);

const objectElement = ref<HTMLObjectElement | null>(null);

// on browsers other than Safari, listen for error events on the object element to show the error message
if (view.objectErrorEventsSupported) {
  useEventListener(objectElement, 'error', () => {
    // remove object element and show error message
    renderObject.value = false;
    showErrorMessage.value = true;

    // push hostname of unloadable post to unembeddableHostnames set
    if (content.currentPostItem?.url) {
      unembeddableHostnames.add(content.currentPostItem.url.hostname);
    }
  });
}

const currentErrorFaceKey = ref('');

watch(
  () => content.currentPostItem,
  () => {
    const otherErrorFaceKeys = Object.keys(errorFaces).filter(
      (key) => key !== currentErrorFaceKey.value
    );

    currentErrorFaceKey.value =
      otherErrorFaceKeys[Math.floor(Math.random() * otherErrorFaceKeys.length)];
  },
  { immediate: true }
);

function openInExternalTab() {
  window.open(content.currentPostItem?.url?.href, '_blank');
}
</script>
