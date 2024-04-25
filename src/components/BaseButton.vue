<template>
  <button
    class="flex items-center rounded-sm transition-colors duration-200 hover:bg-gray-700/15 hover:duration-0 active:bg-gray-700/20"
    :class="[
      small ? 'h-6 p-0.5' : 'h-8 p-1',
      $slots.default && !icon ? 'px-2' : '',
      $slots.default && icon ? 'pr-2' : '',
      bordered ? 'border border-gray-200' : '',
    ]"
  >
    <BaseLabel
      :icon="icon"
      :small="small"
    >
      <slot />
    </BaseLabel>
  </button>
</template>

<script setup lang="ts">
import BaseLabel from '@/components/BaseLabel.vue';

const props = defineProps<{
  icon?: string;
  small?: boolean;
  bordered?: boolean;
}>();
</script>
