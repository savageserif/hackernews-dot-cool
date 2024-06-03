<template>
  <PageColumnBody
    ref="containerElement"
    class="scroll-pt-[2.625rem] space-y-px"
  >
    <Suspense>
      <CommentItem
        v-if="hasDescription"
        :item="content.currentPostItem!"
        class="relative z-20 -mb-2"
      />
    </Suspense>
    <div
      v-show="hasComments && someThreadInstancesVisible"
      class="sticky top-0 z-10 mx-auto max-w-150 bg-gradient-to-b from-white from-20% to-white/0 px-2 pt-2"
    >
      <div class="flex rounded-[0.15625rem] border border-gray-200 bg-gray-100 px-2 py-1">
        <div class="flex flex-1 items-center gap-1"></div>
        <div class="flex items-center gap-0.5 px-1 text-gray-500">
          Thread {{ currentThreadIndex + 1 }} of {{ threadItemCount }}
        </div>
        <div class="flex flex-1 items-center justify-end gap-1">
          <BaseButton
            icon="chevron-up"
            small
            :disabled="currentThreadIndex <= 0"
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
      v-for="(threadItems, index) in threadGroups"
      :key="index"
    >
      <Suspense @resolve="isLoadingThreadGroup = false">
        <CommentItem
          v-for="(threadItem, index) in threadItems"
          ref="threadInstances"
          :key="index"
          :item="threadItem"
          :level="0"
          :first-of-level="index === 0"
          :last-of-level="false"
          :consecutive-last-levels="0"
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
import { useInfiniteScroll } from '@vueuse/core';
import type { HackerNewsItem } from '@/types';
import { apiItemUrl } from '@/utils';
import BaseButton from '@/components/BaseButton.vue';
import PageColumnBody from '@/components/PageColumnBody.vue';
import CommentItem from '@/components/CommentItem.vue';
import StatusItem from '@/components/StatusItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

const containerElement = ref<ComponentPublicInstance | null>(null);

const threadIds = computed(() => content.currentPostItem?.kids ?? []);

const hasDescription = computed(() => !!content.currentPostItem?.text);
const hasComments = computed(() => threadIds.value.length > 0);

const threadItems = ref<HackerNewsItem[]>([]);
const threadItemCount = computed(() => threadItems.value.length);

// thread items are grouped together to enable incrementally loading subsequent groups;
// the items within these groups are what is rendered as CommentItem instances
const threadGroups = ref<HackerNewsItem[][]>([]);

// depending on the number of total comments, the number of items in a group is between 3 and 10
const threadGroupSize = computed(() =>
  Math.min(Math.max(Math.round(1000 / (content.currentPostItem?.descendants ?? 1)), 3), 10)
);

const groupedThreadItemsCount = computed(() => threadGroups.value.flat().length);

const threadInstances = ref<ComponentPublicInstance[]>([]);
const threadInstanceCount = computed(() => threadInstances.value.length);
const someThreadInstancesVisible = computed(() => threadInstanceCount.value > 0);
const allThreadInstancesVisible = computed(
  () => threadInstanceCount.value >= threadItemCount.value
);

// fetch all thread items (thread refers to a top-level comment)
async function fetchThreadItems() {
  threadItems.value = [];
  threadGroups.value = [];

  const fetchedItems: HackerNewsItem[] = await Promise.all(
    threadIds.value.map(async (id) => {
      return await fetch(apiItemUrl(id)).then((response) => response.json());
    })
  );

  const validItems = fetchedItems.filter(
    (threadItem) => !threadItem.dead && !threadItem.deleted && threadItem.text
  );

  threadItems.value.push(...validItems);

  // load the initial group of thread items
  loadThreadGroup();
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
      rootMargin: '-42px 0px 0px 0px',
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

const statusItemInstance = ref<ComponentPublicInstance | null>(null);

function scrollThreadIntoView(index: number) {
  if (index < 0 || index >= threadItemCount.value) return;

  // if the index points to a thread that is not yet visible, scroll the loading item into view instead
  // (triggering loadThreadGroup)
  const element =
    index >= threadInstanceCount.value
      ? statusItemInstance.value?.$el
      : threadInstances.value[index].$el;

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
</script>
