<template>
  <div class="space-y-px @container">
    <div
      class="mx-auto flex max-w-150 pl-3.5 pr-3.5 @comment-detached:rounded"
      :class="[isCollapsed ? 'bg-controls-color shadow-border-y shadow-controls-color' : '']"
    >
      <div
        v-for="index in outsideIndentations"
        :key="index"
        class="my-3.5 mr-3 w-0.5 flex-none self-stretch rounded bg-indentation-color"
        :class="
          insideIndentations > 0 || index < outsideIndentations || !firstOfLevel
            ? 'shadow-indentation-t shadow-indentation-color'
            : ''
        "
      />
      <div
        class="flex w-full min-w-0 flex-1"
        :class="[
          !isPostDescription && !isCollapsed ? 'shadow-border-b shadow-separator-color' : '',
        ]"
      >
        <div
          v-for="index in insideIndentations"
          :key="index"
          class="mb-3.5 mr-3 mt-3.5 w-0.5 flex-none self-stretch rounded bg-indentation-color"
          :class="
            index < insideIndentations || !firstOfLevel
              ? 'shadow-indentation-t shadow-indentation-color'
              : ''
          "
        />
        <div class="w-full flex-1">
          <div
            class="flex items-center pb-3 pt-2.5 text-secondary-color"
            :class="[
              !isPostDescription ? (isCollapsed ? 'cursor-s-resize' : 'cursor-n-resize') : '',
            ]"
            @click="toggleCollapsed()"
          >
            <div class="flex-1">
              <span class="font-serif text-base-serif italic">{{ item.by }}</span>
              <span
                v-if="item.by === content.currentPostItem?.by"
                class="my-[-0.25rem] ml-1.5 inline-block rounded bg-selection-color/90 px-1 pb-[0.21875rem] pt-[0.0625rem] leading-3 text-accent-color [font-feature-settings:'smcp','c2sc']"
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
            ref="commentTextElement"
            v-show="!isCollapsed"
            class="-mt-1 mb-3 select-text space-y-[0.4375rem] leading-paragraph-narrow [overflow-wrap:anywhere] @comment-wide:space-y-1.5 @comment-wide:leading-paragraph-wide"
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
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useRouter } from 'vue-router';
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

const router = useRouter();
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

const commentTextElement = ref<Element | null>(null);
const commentText = ref('');

// re-format comment text if it changes (only relevant if this is a post’s description, as that component persists)
watchEffect(() => {
  // add a prepended p tag because HN comments start with only a text node
  commentText.value = domPurifyInstance.sanitize('<p>' + props.item.text);
});

// find links to other HN posts and make them open within the app instead of as external links
onMounted(() => {
  const linkElements = commentTextElement.value?.querySelectorAll(
    'a[href^="https://news.ycombinator.com/item"]'
  );

  if (!linkElements || linkElements.length < 1) return;

  linkElements?.forEach((linkElement) => {
    const linkedPostId = linkElement.getAttribute('href')?.match(/\d+/);
    if (!linkedPostId || linkedPostId.length !== 1) return;

    linkElement.addEventListener('click', (event) => {
      router.push({ name: 'post', params: { postId: linkedPostId[0] } });
      event.preventDefault();
    });
  });
});
</script>

<style lang="postcss">
div[class*='leading-paragraph'] a {
  @apply text-accent-color underline decoration-transparent underline-offset-2 transition-colors duration-200;
}

div[class*='leading-paragraph'] a:hover {
  @apply decoration-accent-color/80 duration-0;
}

div[class*='leading-paragraph'] a:focus {
  @apply: outline-none;
}

div[class*='leading-paragraph'] a:focus-visible {
  @apply outline-focus-color;
}

div[class*='leading-paragraph'] em,
div[class*='leading-paragraph'] i {
  @apply font-medium;
}

div[class*='leading-paragraph'] pre {
  @apply !my-3 overflow-x-auto rounded bg-controls-color px-3 pb-2.5 pt-2 text-small;
}
</style>
