<template>
  <div
    v-if="!(commentItem.deleted || commentItem.dead) && commentItem.text"
    class="max-w-150 mx-auto pr-3.5"
    :style="{ paddingLeft: `${level * 0.875}rem` }"
  >
    <div class="shadow-border-b space-y-2 pb-3 pt-2.5 shadow-gray-200">
      <div class="flex items-baseline text-gray-500">
        <div class="flex-1">
          <span class="font-serif text-base-serif italic">{{ commentItem.by }}</span>
          <span
            v-if="commentItem.by === postBy"
            class="leading-3 my-[-0.25rem] ml-1.5 inline-block rounded-sm bg-orange-200/90 px-1 pb-[0.21875rem] pt-[0.0625rem] text-orange-700 [font-feature-settings:'smcp','c2sc']"
          >
            OP
          </span>
        </div>
        <span :title="absoluteTimestamp(commentItem.time)">
          {{ relativeTimestamp }}
        </span>
      </div>
      <div
        class="select-text space-y-[0.4375rem] break-words leading-paragraph-narrow"
        v-html="commentText"
      />
    </div>
  </div>
  <CommentItem
    v-for="(nestedCommentId, index) in commentItem?.kids"
    :key="index"
    :id="nestedCommentId"
    :level="level + 1"
    :post-by="postBy"
  />
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import smartquotes from 'smartquotes-ts';
import type { HackerNewsItem } from '@/types';
import { apiItemUrl, absoluteTimestamp } from '@/utils';
import CommentItem from '@/components/CommentItem.vue';
import { useRelativeTimestamp } from '@/composables/relativeTimestamp';

const props = defineProps<{
  id: number;
  level: number;
  postBy?: string;
}>();

const commentItem: HackerNewsItem = await fetch(apiItemUrl(props.id)).then((response) =>
  response.json()
);

const { text: relativeTimestamp } = useRelativeTimestamp(commentItem.time, true);

DOMPurify.addHook('afterSanitizeElements', (node) => {
  if (node.nodeName && node.nodeName === '#text') {
    node.textContent = smartquotes(node.textContent);
  }
});

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
  }
});

const commentText = DOMPurify.sanitize('<p>' + commentItem.text);

DOMPurify.removeAllHooks();
</script>

<style lang="postcss">
div[class*='leading-paragraph'] a {
  @apply text-orange-700 underline decoration-transparent underline-offset-2 transition-colors duration-200;
}

div[class*='leading-paragraph'] a:hover {
  @apply decoration-orange-600 duration-0;
}

div[class*='leading-paragraph'] em,
div[class*='leading-paragraph'] i {
  font-weight: 500;
}
</style>
