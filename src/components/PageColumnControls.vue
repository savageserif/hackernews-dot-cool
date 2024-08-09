<template>
  <div
    class="flex flex-initial items-center bg-controls-color"
    :class="[
      view.isTouchDevice ? 'h-12' : 'h-10',
      bottom && view.isStandaloneDisplayMode
        ? 'h-auto pb-[calc(0.25rem+env(safe-area-inset-bottom))] pt-1'
        : '',
    ]"
  >
    <div class="flex flex-1 items-center gap-1 px-1">
      <slot name="left" />
    </div>
    <div class="flex min-w-0 items-center gap-0.5 px-1">
      <slot name="center" />
    </div>
    <div class="relative flex flex-1 items-center justify-end gap-1 px-1">
      <div
        v-if="$slots.right && divider === 'right'"
        class="w-px bg-separator-color"
        :class="[view.isTouchDevice ? 'h-12' : 'h-10']"
      />
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useViewStore } from '@/stores/ViewStore';

const view = useViewStore();

const props = defineProps<{
  bottom?: boolean;
  divider?: 'right';
}>();
</script>
