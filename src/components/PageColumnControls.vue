<template>
  <div class="flex h-10 flex-initial items-center bg-controls-color">
    <div class="flex flex-1 items-center gap-1 px-1">
      <slot name="left" />
    </div>
    <div class="flex items-center gap-0.5 px-1">
      <slot name="center" />
    </div>
    <div class="relative flex flex-1 items-center justify-end gap-1 px-1">
      <div
        v-if="$slots.right && divider === 'right'"
        class="h-10 w-px bg-separator-color"
      />
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  divider?: 'right';
}>();
</script>
