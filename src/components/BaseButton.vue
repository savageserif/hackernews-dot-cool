<template>
  <button
    class="flex items-center ring-focus-color ring-offset-1 ring-offset-controls-color transition-colors duration-200 hover:duration-0 focus:outline-none focus-visible:ring-2"
    :class="[
      small ? 'h-6 p-0.5' : 'h-8 p-1',
      $slots.default && !icon ? 'px-2' : '',
      $slots.default && icon ? 'pr-2' : '',
      bordered
        ? 'rounded-outline border border-separator-color hover:border-primary-color/10 active:border-primary-color/10'
        : 'rounded',
      disabled ? 'opacity-25' : 'hover:bg-primary-color/10 active:bg-primary-color/15',
    ]"
    :disabled="disabled"
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
  disabled?: boolean;
}>();
</script>
