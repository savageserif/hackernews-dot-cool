<template>
  <div
    v-show="view.availableColumns >= 2"
    class="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto bg-controls-color pb-2"
  >
    <img
      class="w-[7.625rem]"
      :src="view.darkColorSchemeIsActive ? placeholderDarkAsset : placeholderAsset"
    />
    <span
      class="font-serif-heading text-[1.5rem] font-bold text-secondary-color/55 dark:text-[#000]/40"
    >
      No story selected
    </span>
  </div>
</template>

<script setup lang="ts">
import placeholderAsset from '@/assets/images/no-selection.png';
import placeholderDarkAsset from '@/assets/images/no-selection.dark.png';
import { useViewStore } from '@/stores/ViewStore';

const view = useViewStore();
</script>
