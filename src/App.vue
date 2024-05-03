<template>
  <main
    class="flex h-full select-none gap-px bg-gray-200 font-sans text-base font-normal text-gray-950 antialiased"
  >
    <ThePostsColumn :class="[view.availableColumns < 2 ? 'flex-1' : 'flex-none basis-90']" />
    <ThePrimaryColumn
      v-show="view.availableColumns >= 2"
      class="min-w-90 flex-1"
    />
    <TheSecondaryColumn
      v-show="view.availableColumns >= 3 && view.secondaryColumn.open"
      class="flex-none"
      :style="{
        flexBasis:
          view.secondaryColumn.expandable && view.secondaryColumn.expanded
            ? view.secondaryColumn.expandedWidth
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

const view = useViewStore();
</script>

<style>
#app {
  height: 100vh;
}
</style>
