<template>
  <main
    class="flex h-full select-none gap-px bg-gray-200 font-sans text-base font-normal text-gray-950 antialiased"
  >
    <ThePostsColumn class="flex-none basis-90" />
    <TheContentColumn class="min-w-90 flex-1" />
    <TheCommentsColumn
      v-show="view.secondaryColumnVisible"
      class="flex-none"
      :style="{
        flexBasis:
          view.secondaryColumnExpandable && view.secondaryColumnSize === 'expanded'
            ? view.secondaryColumnExpandedWidth
            : '22.5rem',
      }"
    />
  </main>
</template>

<script setup lang="ts">
import ThePostsColumn from '@/components/ThePostsColumn.vue';
import TheContentColumn from '@/components/TheContentColumn.vue';
import TheCommentsColumn from '@/components/TheCommentsColumn.vue';
import { useViewStore } from '@/stores/ViewStore';

const view = useViewStore();
</script>

<style>
#app {
  height: 100vh;
}
</style>
