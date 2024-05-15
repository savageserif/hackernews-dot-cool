<template>
  <div
    v-if="commentItem && !(commentItem.deleted || commentItem.dead) && commentItem.text"
    class="max-w-150 mx-auto flex pl-3.5 pr-3.5 hover:bg-gray-50"
  >
    <div
      v-for="index in outsideIndentations"
      :key="index"
      class="my-3.5 mr-3 w-0.5 flex-none self-stretch rounded bg-gray-400"
      :class="
        insideIndentations > 0 || index < outsideIndentations || !firstOfLevel
          ? 'shadow-indentation-t shadow-gray-400'
          : ''
      "
    />
    <div class="shadow-border-b flex w-full min-w-0 flex-1 pb-3 pt-2.5 shadow-gray-200">
      <div
        v-for="index in insideIndentations"
        :key="index"
        class="mb-0.5 mr-3 mt-1 w-0.5 flex-none self-stretch rounded bg-gray-400"
        :class="
          index < insideIndentations || !firstOfLevel ? 'shadow-indentation-t shadow-gray-400' : ''
        "
      />
      <div class="w-full flex-1 space-y-2">
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
          class="select-text space-y-[0.4375rem] leading-paragraph-narrow [overflow-wrap:anywhere]"
          v-html="commentText"
        />
      </div>
    </div>
  </div>
  <template v-if="commentItem && hasKids">
    <CommentItem
      v-for="(commentId, index) in commentItem.kids"
      :key="index"
      :id="commentId"
      :level="level + 1"
      :first-of-level="index === 0"
      :last-of-level="index === commentItem.kids!.length - 1"
      :consecutive-last-levels="
        index === commentItem.kids!.length - 1 ? consecutiveLastLevels + 1 : 0
      "
      :post-by="postBy"
    />
  </template>
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
  firstOfLevel: boolean;
  lastOfLevel: boolean;
  consecutiveLastLevels: number;
  postBy?: string;
}>();

const commentItem: HackerNewsItem | null = await fetch(apiItemUrl(props.id)).then((response) =>
  response.json()
);

const hasKids = commentItem && commentItem.kids && commentItem.kids.length !== 0 ? true : false;

// if a comment is the last of its current level and has no kids, it needs an inside indentation
// for each consecutive last level counting down from the current one. in all other cases,
// only outside indentations are needed
const insideIndentations = props.lastOfLevel && !hasKids ? props.consecutiveLastLevels : 0;
const outsideIndentations = props.level - insideIndentations;

const { text: relativeTimestamp } = useRelativeTimestamp(commentItem?.time, true);

// run text content of comments through smartquotes
DOMPurify.addHook('afterSanitizeElements', (node) => {
  if (node.nodeName && node.nodeName === '#text') {
    node.textContent = smartquotes(node.textContent);
  }
});

// add target="_blank" attribute to all links
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
  }
});

// add a prepended p tag because HN comments start with only a text node
const commentText = DOMPurify.sanitize('<p>' + commentItem?.text);

// remove hooks, as they otherwise accumulate from all CommentItem instances
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
