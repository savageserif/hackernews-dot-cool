<template>
  <div class="flex-1 overflow-hidden bg-blank-color">
    <div
      ref="scrollContainerElement"
      class="h-full overflow-y-auto"
      :class="class"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string | (string | false)[];
}>();

const scrollContainerElement = ref<HTMLDivElement | null>(null);
defineExpose({ scrollContainerElement });
</script>
