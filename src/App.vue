<template>
  <main
    class="flex h-dvh select-none gap-px bg-separator-color font-sans text-base text-primary-color antialiased selection:bg-selection-color selection:text-primary-selected-color"
  >
    <ThePostsListColumn
      v-show="view.availableColumns >= 2 || route.name === 'no-selection'"
      :class="[view.availableColumns === 1 ? 'flex-1' : 'flex-none basis-90']"
    />
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import ThePostsListColumn from '@/components/ThePostsListColumn.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const route = useRoute();
const view = useViewStore();
const content = useContentStore();

content.fetchPostIds();

// update page title to match current route and post item
watchEffect(() => {
  if (route.name === 'post' && content.currentPostItem) {
    document.title = `${content.currentPostItem.title} · Hacker News`;
  } else {
    document.title = `${content.currentCategoryName} · Hacker News`;
  }
});
</script>
