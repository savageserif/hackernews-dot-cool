<template>
  <div class="space-y-px @container">
    <div
      class="@comment-detached:rounded mx-auto flex max-w-150 pl-3.5 pr-3.5"
      :class="[isCollapsed ? 'bg-gray-100 shadow-border-y shadow-gray-100' : '']"
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
      <div
        class="flex w-full min-w-0 flex-1"
        :class="[!isPostDescription && !isCollapsed ? 'shadow-border-b shadow-gray-200' : '']"
      >
        <div
          v-for="index in insideIndentations"
          :key="index"
          class="mb-3.5 mr-3 mt-3.5 w-0.5 flex-none self-stretch rounded bg-gray-400"
          :class="
            index < insideIndentations || !firstOfLevel
              ? 'shadow-indentation-t shadow-gray-400'
              : ''
          "
        />
        <div class="w-full flex-1">
          <div
            class="flex items-center pb-3 pt-2.5 text-gray-500"
            :class="[
              !isPostDescription ? (isCollapsed ? 'cursor-s-resize' : 'cursor-n-resize') : '',
            ]"
            @click="toggleCollapsed()"
          >
            <div class="flex-1">
              <span class="font-serif text-base-serif italic">{{ item.by }}</span>
              <span
                v-if="item.by === content.currentPostItem?.by"
                class="my-[-0.25rem] ml-1.5 inline-block rounded bg-orange-200/90 px-1 pb-[0.21875rem] pt-[0.0625rem] leading-3 text-orange-700 [font-feature-settings:'smcp','c2sc']"
              >
                OP
              </span>
            </div>
            <div
              class="flex items-center gap-1"
              :title="!isCollapsed ? absoluteTimestamp(item.time) : ''"
            >
              <BaseIcon
                v-show="isCollapsed"
                class="-my-1"
                name="comment-collapse"
                small
              />
              {{
                isCollapsed
                  ? `${descendants} comment${descendants !== 1 ? 's' : ''}`
                  : relativeTimestamp
              }}
            </div>
          </div>
          <div
            v-show="!isCollapsed"
            class="@comment-wide:space-y-1.5 @comment-wide:leading-paragraph-wide -mt-1 mb-3 select-text space-y-[0.4375rem] leading-paragraph-narrow [overflow-wrap:anywhere]"
            v-html="commentText"
          />
        </div>
      </div>
    </div>
    <CommentItem
      v-for="(kidItem, index) in kidItems"
      v-show="!isCollapsed"
      :key="index"
      :item="kidItem"
      :level="level + 1"
      :first-of-level="index === 0"
      :last-of-level="index === kidItems.length - 1"
      :consecutive-last-levels="index === kidItems.length - 1 ? consecutiveLastLevels + 1 : 0"
      @count-descendant="
        descendants += 1;
        $emit('countDescendant');
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import DOMPurify from 'dompurify';
import smartquotes from 'smartquotes-ts';
import type { HackerNewsItem } from '@/types';
import { apiItemUrl, absoluteTimestamp } from '@/utils';
import BaseIcon from '@/components/BaseIcon.vue';
import CommentItem from '@/components/CommentItem.vue';
import { useRelativeTimestamp } from '@/composables/relativeTimestamp';
import { useContentStore } from '@/stores/ContentStore';

const props = withDefaults(
  defineProps<{
    item: HackerNewsItem;
    level?: number;
    firstOfLevel?: boolean;
    lastOfLevel?: boolean;
    consecutiveLastLevels?: number;
  }>(),
  {
    level: 0,
    firstOfLevel: false,
    lastOfLevel: false,
    consecutiveLastLevels: 0,
  }
);

const content = useContentStore();

// if item data does not contain 'parent' key, this is a post’s description text that appears above the comment threads
const isPostDescription = !('parent' in props.item);

const isCollapsed = ref(false);
function toggleCollapsed() {
  if (isPostDescription) return;
  isCollapsed.value = !isCollapsed.value;
}

// count total recursive descendants by emitting events to potential higher-level comment instances
const descendants = ref(1);
const emit = defineEmits(['countDescendant']);
emit('countDescendant');

const kidIds = ref<number[]>(!isPostDescription && props.item.kids ? props.item.kids : []);
const kidItems = ref<HackerNewsItem[]>([]);

// fetch nested comments if kids exist
const fetchedItems: HackerNewsItem[] = await Promise.all(
  kidIds.value.map(async (id) => {
    return await fetch(apiItemUrl(id)).then((response) => response.json());
  })
);

const validItems = fetchedItems.filter(
  (threadItem) => !threadItem.dead && !threadItem.deleted && threadItem.text
);

kidItems.value.push(...validItems);

// if a comment is the last of its current level and has no kids, it needs an inside indentation
// for each consecutive last level counting down from the current one. in all other cases,
// only outside indentations are needed
const insideIndentations =
  props.lastOfLevel && kidIds.value.length === 0 ? props.consecutiveLastLevels : 0;
const outsideIndentations = props.level - insideIndentations;

const { text: relativeTimestamp } = useRelativeTimestamp(
  computed(() => props.item.time),
  true
);


const domPurifyInstance = DOMPurify();

// optimize/format comment text
domPurifyInstance.addHook('afterSanitizeElements', (node) => {
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
domPurifyInstance.addHook('afterSanitizeAttributes', (node) => {
  if ('target' in node) {
    node.setAttribute('target', '_blank');
  }
});

const commentText = ref('');

// re-format comment text if it changes
watchEffect(() => {
  // add a prepended p tag because HN comments start with only a text node
  commentText.value = domPurifyInstance.sanitize('<p>' + props.item.text);
});
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
  @apply !my-3 overflow-x-auto rounded bg-gray-500/10 px-3 pb-2.5 pt-2 text-small;
}
</style>
