<template>
  <div class="space-y-px">
    <div
      v-if="commentItem && !(commentItem.deleted || commentItem.dead) && commentItem.text"
      class="@container max-w-150 mx-auto flex pl-3.5 pr-3.5"
      :class="[isCollapsed ? 'bg-gray-100 hover:bg-gray-100' : 'hover:bg-gray-50']"
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
      <div class="shadow-border-b flex w-full min-w-0 flex-1 shadow-gray-200">
        <div
          v-for="index in insideIndentations"
          :key="index"
          class="my-3.5 mr-3 w-0.5 flex-none self-stretch rounded bg-gray-400"
          :class="
            index < insideIndentations || !firstOfLevel
              ? 'shadow-indentation-t shadow-gray-400'
              : ''
          "
        />
        <div class="w-full flex-1">
          <div
            class="flex items-baseline pb-3 pt-2.5 text-gray-500"
            :class="[isCollapsed ? 'cursor-s-resize' : 'cursor-n-resize']"
            @click="isCollapsed = !isCollapsed"
          >
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
            v-show="!isCollapsed"
            class="@sm:leading-paragraph-wide @sm:space-y-1.5 -mt-1 mb-3 select-text space-y-[0.4375rem] leading-paragraph-narrow [overflow-wrap:anywhere]"
            v-html="commentText"
          />
        </div>
      </div>
    </div>
    <template v-if="commentItem && hasKids">
      <CommentItem
        v-for="(commentId, index) in commentItem.kids"
        v-show="!isCollapsed"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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

const isCollapsed = ref(false);

const { text: relativeTimestamp } = useRelativeTimestamp(commentItem?.time, true);

// run text content of comments through smartquotes
DOMPurify.addHook('afterSanitizeElements', (node) => {
  if (node.nodeName && node.nodeName === '#text') {
    if (!node.textContent) return;

    const leadingSpaces = node.textContent.match(/^ {2,}/);

    if (leadingSpaces) {
      const spacesCount = leadingSpaces[0].length;
      const firstLinePattern = new RegExp(`^ {${spacesCount}}`);
      const subsequentLinePattern = new RegExp(`\n {${spacesCount}}`, 'g');
      node.textContent = node.textContent
        .replace(firstLinePattern, '')
        .replace(subsequentLinePattern, '\n');
    }

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

div[class*='leading-paragraph'] a:focus {
  @apply: outline-none;
}

div[class*='leading-paragraph'] a:focus-visible {
  @apply outline-blue;
}

div[class*='leading-paragraph'] em,
div[class*='leading-paragraph'] i {
  @apply font-medium;
}

div[class*='leading-paragraph'] pre {
  @apply !my-3 overflow-x-auto rounded-sm bg-gray-500/10 px-3 pb-2.5 pt-2 text-small;
}
</style>
