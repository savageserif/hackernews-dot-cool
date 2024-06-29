<template>
  <ThePrimaryColumn
    v-show="view.availableColumns >= 2 || route.name === 'post'"
    class="min-w-90"
    :class="[
      view.prioritizedView === 'comments' &&
      view.availableColumns === 3 &&
      view.secondaryColumn.isExpandable &&
      view.secondaryColumn.isOpen
        ? 'flex-none'
        : 'flex-1',
    ]"
    :style="{
      flexBasis: !view.secondaryColumn.isExpanded ? view.commentsColumn.maxWidth : '22.5rem',
    }"
  />
  <TheSecondaryColumn
    v-show="content.currentPostItem && view.availableColumns === 3 && view.secondaryColumn.isOpen"
    class="min-w-90"
    :class="[
      view.prioritizedView === 'link' || !view.secondaryColumn.isExpandable
        ? 'flex-none'
        : 'flex-1',
    ]"
    :style="{
      flexBasis:
        view.secondaryColumn.isExpandable && view.secondaryColumn.isExpanded
          ? view.commentsColumn.maxWidth
          : '22.5rem',
    }"
  />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ThePrimaryColumn from '@/components/ThePrimaryColumn.vue';
import TheSecondaryColumn from '@/components/TheSecondaryColumn.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const props = defineProps<{
  postId: number;
}>();

const router = useRouter();
const route = useRoute();
const view = useViewStore();
const content = useContentStore();

// whenever the postId prop changes thorugh router, update the current post item
watch(
  () => props.postId,
  async () => {
    const postItem = content.currentCategoryPostItems?.items.find(
      (postItem) => postItem.id === props.postId
    );

    if (postItem) {
      content.setCurrentPostItem(postItem);
    } else {
      const fetchedPostItem = await content.fetchPostItem(props.postId);

      // if post item cannot be fetched, return to no selection route, replacing the current history entry
      if (fetchedPostItem === null) {
        router.replace({ name: 'no-selection' });
        return;
      }

      content.setCurrentPostItem(fetchedPostItem);
    }
  },
  { immediate: true }
);
</script>
