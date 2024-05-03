<template>
  <main
    class="flex h-full select-none gap-px bg-gray-200 font-sans text-base text-gray-950 antialiased"
  >
    <ThePostsColumn :class="[view.availableColumns < 2 ? 'flex-1' : 'flex-none basis-90']" />
    <ThePrimaryColumn
      v-show="view.availableColumns >= 2"
      class="min-w-90"
      :class="[
        settings.prioritizedView === 'comments' &&
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
        settings.prioritizedView === 'link' || !view.secondaryColumn.isExpandable
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
  </main>
</template>

<script setup lang="ts">
import ThePostsColumn from '@/components/ThePostsColumn.vue';
import ThePrimaryColumn from '@/components/ThePrimaryColumn.vue';
import TheSecondaryColumn from '@/components/TheSecondaryColumn.vue';
import { useViewStore } from '@/stores/ViewStore';
import { useSettingsStore } from '@/stores/SettingsStore';

const view = useViewStore();
const settings = useSettingsStore();
</script>

<style>
#app {
  height: 100vh;
}
</style>
