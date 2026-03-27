<template>
  <PageColumnBody
    ref="pageColumnBodyInstance"
    :class="[
      view.isStandaloneDisplayMode &&
        (!content.currentPostItemHasLink || view.availableColumns === 3) &&
        'pb-[env(safe-area-inset-bottom)]',
    ]"
  >
    <CommentItem
      v-if="hasDescription"
      :item="{
        id: content.currentPostItem!.id,
        user: content.currentPostItem!.by,
        time: content.currentPostItem!.time,
        content: content.currentPostItem!.text,
      }"
      is-description
      class="relative z-20 -mb-2"
    />
    <div
      v-show="hasComments && !threadItemsError && !threadItemsLoading"
      class="sticky top-0 z-10 mx-auto max-w-150 px-2 pt-2"
    >
      <div
        class="flex rounded-outline border border-separator-color bg-controls-color px-2 py-1 shadow-[0_-1rem_0.125rem_-0.1875rem] shadow-blank-color"
      >
        <div class="flex flex-1 items-center gap-1"></div>
        <div class="flex items-center gap-0.5 px-1 text-secondary-color">
          Thread {{ currentThreadIndex + 1 }} of {{ threadItemCount }}
        </div>
        <div
          class="flex flex-1 items-center justify-end"
          :class="[!view.isTouchDevice ? 'gap-1' : '']"
        >
          <BaseButton
            icon="chevron-up"
            small
            :disabled="!firstThreadScrolledPastTopEdge"
            @click="scrollThreadIntoView(currentThreadIndex - 1)"
          />
          <BaseButton
            icon="chevron-down"
            small
            :disabled="currentThreadIndex + 1 >= threadItemCount"
            @click="scrollThreadIntoView(currentThreadIndex + 1)"
          />
        </div>
      </div>
    </div>
    <CommentItem
      v-for="(threadItem, index) in threadItems"
      ref="threadInstances"
      :key="index"
      :item="threadItem"
      :class="[
        index + 1 < threadItemCount ? 'mb-px' : '',
        view.isTouchDevice ? 'scroll-mt-[3.125rem]' : 'scroll-mt-[2.625rem]',
      ]"
    />
    <BaseStatusIndicator
      ref="statusIndicatorInstance"
      v-show="!hasComments || threadItemsError || threadItemsLoading"
      :full-height="
        !hasDescription && (!hasComments || threadItemsError !== null || threadItemsLoading)
      "
      :message="statusMessage"
    />
  </PageColumnBody>
</template>

<script setup lang="ts">
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import type PageColumnBody from '@/components/page/PageColumnBody.vue';

const view = useViewStore();
const content = useContentStore();

const hasDescription = computed(() => !!content.currentPostItem?.text);
const hasComments = computed(
  () =>
    content.currentPostItem?.descendants !== 0 &&
    content.currentPostItem?.kids &&
    content.currentPostItem?.kids.length > 0
);

const threadItems = ref<HackerWebItem[]>([]);
const threadItemCount = computed(() => threadItems.value.length);

const threadItemsError = ref<null | unknown>(null);
const threadItemsLoading = ref(true);

const threadInstances = ref<ComponentPublicInstance[]>([]);
const threadInstanceCount = computed(() => threadInstances.value.length);

const statusMessage = computed(() => {
  if (!hasComments.value) {
    return 'So far, no comments have been left on this story.';
  } else if (threadItemsError.value) {
    return 'An error has occurred while loading this post’s comments.';
  }
});

let abortController: AbortController | null = null;

// get all thread items (top-level comments) by fetching post item from HackerWeb API
async function fetchThreadItems() {
  // abort previous unresolved fetch request if applicable
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  const signal = abortController.signal;

  threadItems.value = [];
  threadItemsError.value = null;
  threadItemsLoading.value = true;

  try {
    const response = await fetch(hackerwebApiItemUrl(content.currentPostItem!.id), { signal });
    if (!response.ok) throw new Error(response.statusText);

    const fetchedPostItem: HackerWebItem | null = await response.json();
    if (!fetchedPostItem || !fetchedPostItem.comments) return;

    const validThreadItems = fetchedPostItem.comments.filter(
      (threadItem) => threadItem.user && threadItem.content
    );

    threadItems.value.push(...validThreadItems);
  } catch (error) {
    console.error(
      `Error fetching HackerWeb post item with ID ${content.currentPostItem!.id}:`,
      error
    );
    threadItemsError.value = error;
  } finally {
    threadItemsLoading.value = false;
  }
}

// when the current post changes, re-fetch thread items
watch(
  () => content.currentPostItem,
  () => {
    fetchThreadItems();
  },
  { immediate: true }
);

const pageColumnBodyInstance = ref<InstanceType<typeof PageColumnBody> | null>(null);
const scrollContainerElement = computed(() => pageColumnBodyInstance.value?.scrollContainerElement);

const threadVisibilities = ref<boolean[]>([]);
const currentThreadIndex = computed(() =>
  Math.max(
    threadVisibilities.value.findIndex((item) => item === true),
    0
  )
);

// monitor the currently visible topmost thread through an intersection observer
onMounted(() => {
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute('data-index') ?? '');
        threadVisibilities.value[index] = entry.isIntersecting;
      });
    },
    {
      root: scrollContainerElement.value,
      rootMargin: `${view.isTouchDevice ? -50 : -42}px 0px 0px 0px`,
    }
  );

  // when new thread instances are rendered, refresh the intersection observer
  watch(
    () => threadInstances.value,
    () => {
      intersectionObserver.disconnect();

      threadInstances.value.forEach((threadInstance, index) => {
        threadInstance.$el.setAttribute('data-index', index);
        intersectionObserver.observe(threadInstance.$el);
      });
    },
    { deep: true }
  );
});

// offset of the visible top edge of the comments list towards the top of the viewport
const commentsTopEdgeOffset = view.isTouchDevice ? 99 : 83;

// determine whether the first thread is scrolled past its top edge (enabling the "up" button)
const { top: firstThreadTop } = useElementBounding(computed(() => threadInstances.value[0]));
const firstThreadScrolledPastTopEdge = computed(() => firstThreadTop.value < commentsTopEdgeOffset);

const statusIndicatorInstance = ref<ComponentPublicInstance | null>(null);

// whether browser is Safari, needed for changing smooth scrolling method (see below)
const isSafari = /^Apple/.test(navigator.vendor) && !(window as any).chrome;

function scrollThreadIntoView(index: number) {
  index = Math.min(Math.max(index, 0), threadItemCount.value - 1);

  // if the direction is up and the current thread is scrolled past its top edge, scroll to the top
  // of the current thread instead of scrolling to the previous one
  if (
    index < currentThreadIndex.value &&
    threadInstances.value[currentThreadIndex.value].$el.getBoundingClientRect().top <
      commentsTopEdgeOffset - 2
  ) {
    index = currentThreadIndex.value;
  }

  // if the index points to a thread that is not yet visible, scroll the loading item into view instead
  // (triggering loadThreadGroup)
  const element: HTMLElement =
    index >= threadInstanceCount.value
      ? statusIndicatorInstance.value?.$el
      : threadInstances.value[index].$el;

  const scrollOptions = {
    behavior: 'smooth',
    block: 'start',
    duration: 250,
  } as const;

  // on iOS Safari, scrollIntoView from 'smooth-scroll-into-view-if-needed' breaks subsequent
  // getBoundingClientRect() calls, therefore use native scrollIntoView method for Safari instead
  if (isSafari) {
    element.scrollIntoView(scrollOptions);
  } else {
    scrollIntoView(element, {
      ...scrollOptions,
      ease: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    });
  }
}
</script>
