<template>
  <PageColumnBody ref="containerElement">
    <Suspense>
      <CommentItem
        v-if="hasDescription"
        :item="content.currentPostItem!"
        class="relative z-20 -mb-2"
      />
    </Suspense>
    <div
      v-show="hasComments && someThreadInstancesVisible"
      class="sticky top-0 z-10 mx-auto max-w-150 bg-gradient-to-b from-blank-color from-20% to-blank-color/0 px-2 pt-2"
    >
      <div class="flex rounded-outline border border-separator-color bg-controls-color px-2 py-1">
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
            :disabled="!firstThreadScrolledPastTop"
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
    <template
      v-for="(threadItems, groupIndex) in threadGroups"
      :key="groupIndex"
    >
      <Suspense @resolve="isLoadingThreadGroup = false">
        <CommentItem
          v-for="(threadItem, itemIndex) in threadItems"
          ref="threadInstances"
          :key="itemIndex"
          :item="threadItem"
          :class="[
            groupIndex * threadGroupSize + (itemIndex + 1) < threadItemCount ? 'mb-px' : '',
            view.isTouchDevice ? 'scroll-mt-[3.125rem]' : 'scroll-mt-[2.625rem]',
          ]"
        />
      </Suspense>
    </template>
    <StatusItem
      ref="statusItemInstance"
      v-show="!hasComments || !someThreadInstancesVisible || !allThreadInstancesVisible"
      :full-height="!hasDescription && (!hasComments || !someThreadInstancesVisible)"
      :message="!hasComments ? 'So far, no comments have been left on this story.' : undefined"
    />
  </PageColumnBody>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { useInfiniteScroll, useElementBounding } from '@vueuse/core';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import type { HackerNewsItem } from '@/types';
import { apiItemUrl } from '@/utils/apiUrls';
import BaseButton from '@/components/BaseButton.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import CommentItem from '@/components/CommentItem.vue';
import StatusItem from '@/components/StatusItem.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();
const content = useContentStore();

const containerElement = ref<ComponentPublicInstance | null>(null);

const threadIds = computed(() => content.currentPostItem?.kids ?? []);

const hasDescription = computed(() => !!content.currentPostItem?.text);
const hasComments = computed(
  () => content.currentPostItem?.descendants !== 0 && threadIds.value.length > 0
);

const threadItems = ref<HackerNewsItem[]>([]);
const threadItemCount = computed(() => threadItems.value.length);

// thread items are grouped together to enable incrementally loading subsequent groups;
// the items within these groups are what is rendered as CommentItem instances
const threadGroups = ref<HackerNewsItem[][]>([]);

// depending on the number of total comments, the number of items in a group is between 3 and 10
const threadGroupSize = computed(() =>
  Math.min(Math.max(Math.round(500 / (content.currentPostItem?.descendants ?? 1)), 3), 10)
);

const groupedThreadItemsCount = computed(() => threadGroups.value.flat().length);

const threadInstances = ref<ComponentPublicInstance[]>([]);
const threadInstanceCount = computed(() => threadInstances.value.length);
const someThreadInstancesVisible = computed(() => threadInstanceCount.value > 0);
const allThreadInstancesVisible = computed(
  () => threadInstanceCount.value >= threadItemCount.value
);

let abortController: AbortController | null = null;

// fetch all thread items (thread refers to a top-level comment)
async function fetchThreadItems() {
  // abort previous unresolved fetch request if applicable
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  const signal = abortController.signal;

  threadItems.value = [];
  threadGroups.value = [];

  try {
    const fetchedItems: HackerNewsItem[] = await Promise.all(
      threadIds.value.map(async (id) => {
        return await fetch(apiItemUrl(id), { signal }).then((response) => response.json());
      })
    );

    const validItems = fetchedItems.filter(
      (threadItem) => !threadItem.dead && !threadItem.deleted && threadItem.text
    );

    threadItems.value.push(...validItems);

    // load the initial group of thread items
    isLoadingThreadGroup.value = false;
    loadThreadGroup();
  } catch (error) {
    // fetch request aborted
  }
}

// if this is true, it prevents infinite scrolling callbacks from loading multiple thread groups at once
const isLoadingThreadGroup = ref(false);

// push the next slice of threadItems as a new thread group
function loadThreadGroup() {
  if (isLoadingThreadGroup.value) return;

  // when the Suspense component surrounding the thread group's items resolves, this is set back to false
  isLoadingThreadGroup.value = true;

  threadGroups.value.push(
    threadItems.value.slice(
      groupedThreadItemsCount.value,
      groupedThreadItemsCount.value + threadGroupSize.value
    )
  );
}

// when the current post changes, re-fetch thread items
watch(
  () => content.currentPostItem,
  () => {
    fetchThreadItems();
  },
  { immediate: true }
);

// load a new thread group when bottom of comments list is reached
onMounted(() => {
  useInfiniteScroll(
    containerElement.value?.$el,
    () => {
      if (
        someThreadInstancesVisible.value &&
        !allThreadInstancesVisible.value &&
        !isLoadingThreadGroup.value
      ) {
        loadThreadGroup();
      }
    },
    { distance: 60 }
  );
});

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
      root: containerElement.value?.$el,
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

// determine whether the first thread is scrolled past its top edge (enabling the "up" button)
const { top: firstThreadTop } = useElementBounding(computed(() => threadInstances.value[0]));
const firstThreadScrolledPastTop = computed(() => firstThreadTop.value < 83);

const statusItemInstance = ref<ComponentPublicInstance | null>(null);

function scrollThreadIntoView(index: number) {
  index = Math.min(Math.max(index, 0), threadItemCount.value - 1);

  // if the direction is up and the current thread is scrolled past its top edge, scroll to the top
  // of the current thread instead of scrolling to the previous one
  if (
    index < currentThreadIndex.value &&
    threadInstances.value[currentThreadIndex.value].$el.getBoundingClientRect().top < 83
  ) {
    index = currentThreadIndex.value;
  }

  // if the index points to a thread that is not yet visible, scroll the loading item into view instead
  // (triggering loadThreadGroup)
  const element =
    index >= threadInstanceCount.value
      ? statusItemInstance.value?.$el
      : threadInstances.value[index].$el;

  scrollIntoView(element, {
    block: 'start',
    duration: 250,
    ease: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  });
}
</script>
