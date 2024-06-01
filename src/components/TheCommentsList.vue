<template>
  <CommentItem
    v-if="content.currentPostItem?.text"
    :level="0"
    :first-of-level="true"
    :last-of-level="true"
    :consecutive-last-levels="0"
    :post-by="content.currentPostItem?.by"
    class="relative z-20 -mb-2"
  />
  <div
    class="sticky top-0 z-10 mx-auto max-w-150 bg-gradient-to-b from-white from-20% to-white/0 px-2 pt-2"
  >
    <div class="flex rounded-[0.15625rem] border border-gray-200 bg-gray-100 px-2 py-1">
      <div class="flex flex-1 items-center gap-1"></div>
      <div class="flex items-center gap-0.5 px-1 text-gray-500">
        Thread {{ currentThreadIndex + 1 }} of {{ threadCount }}
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
          :disabled="currentThreadIndex + 1 >= threadCount"
          @click="scrollThreadIntoView(currentThreadIndex + 1)"
        />
      </div>
    </div>
  </div>
  <CommentItem
    v-for="(commentId, index) in content.currentPostItem?.kids"
    ref="threadInstances"
    :key="index"
    :id="commentId"
    :level="0"
    :first-of-level="index === 0"
    :last-of-level="false"
    :consecutive-last-levels="0"
    :post-by="content.currentPostItem?.by"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { useParentElement } from '@vueuse/core';
import BaseButton from '@/components/BaseButton.vue';
import CommentItem from '@/components/CommentItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

const threadCount = ref(content.currentPostItem?.kids?.length ?? 0);
const threadInstances = ref<ComponentPublicInstance[]>([]);

const threadVisibilities = ref<boolean[]>([]);
const currentThreadIndex = computed(() =>
  Math.max(
    threadVisibilities.value.findIndex((item) => item === true),
    0
  )
);

const parentElement = useParentElement();

onMounted(async () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        const entryIndex: number = parseInt(entry.target.getAttribute('data-index') ?? '');
        threadVisibilities.value[entryIndex] = entry.isIntersecting;
      });
    },
    {
      root: parentElement.value,
      rootMargin: '-42px 0px 0px 0px',
    }
  );

  threadInstances.value.forEach((threadInstance, index) => {
    threadInstance.$el.setAttribute('data-index', index);
    observer.observe(threadInstance.$el);
  });
});

function scrollThreadIntoView(index: number) {
  if (index < 0 || index >= threadCount.value) return;

  threadInstances.value[index].$el.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
</script>
