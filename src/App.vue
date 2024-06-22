<template>
  <main
    class="flex h-full select-none gap-px bg-separator-color font-sans text-base text-primary-color antialiased selection:bg-selection-color selection:text-primary-selected-color"
    :class="[view.darkColorSchemeIsActive ? 'dark' : '']"
  >
    <ThePostsColumn :class="[view.availableColumns < 2 ? 'flex-1' : 'flex-none basis-90']" />
    <template v-if="content.currentPostItem">
      <ThePrimaryColumn
        v-show="view.availableColumns >= 2"
        class="min-w-90"
        :class="[
          view.prioritizedView === 'comments' &&
          view.availableColumns >= 3 &&
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
        v-show="view.availableColumns >= 3 && view.secondaryColumn.isOpen"
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
    <TheEmptyView
      v-else
      v-show="view.availableColumns >= 2"
    />
  </main>
</template>

<script setup lang="ts">
import ThePostsColumn from '@/components/ThePostsColumn.vue';
import ThePrimaryColumn from '@/components/ThePrimaryColumn.vue';
import TheSecondaryColumn from '@/components/TheSecondaryColumn.vue';
import TheEmptyView from '@/components/TheEmptyView.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useContentStore } from '@/stores/ContentStore';

const view = useViewStore();
const content = useContentStore();

content.fetchPostIds();
</script>

<style>
#app {
  height: 100vh;
}
</style>
