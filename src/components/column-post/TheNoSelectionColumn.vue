<template>
  <div
    v-show="view.availableColumns >= 2"
    class="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto bg-controls-color pb-2"
  >
    <div
      class="w-[7.875rem] text-secondary-color opacity-30 dark:opacity-45"
      :style="{
        filter: !view.darkColorSchemeIsActive ? 'url(#indentation-shadows)' : undefined,
      }"
      v-html="noSelectionImage"
    />
    <span
      class="font-serif-heading text-[1.5rem] font-bold text-secondary-color/55 dark:text-secondary-color/65"
    >
      No story selected
    </span>
  </div>
</template>

<script setup lang="ts">
import noSelectionImage from '@/assets/no-selection.svg?raw';

const view = useViewStore();
</script>
