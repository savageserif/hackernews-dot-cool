<template>
  <button
    class="ring-blue flex items-center rounded-sm ring-offset-1 ring-offset-gray-100 transition-colors duration-200 hover:duration-0 focus:outline-none focus-visible:ring-2"
    :class="[
      small ? 'h-6 p-0.5' : 'h-8 p-1',
      $slots.default && !icon ? 'px-2' : '',
      $slots.default && icon ? 'pr-2' : '',
      bordered
        ? 'rounded-[0.15625rem] border border-gray-200 hover:border-gray-700/15 active:border-gray-700/15'
        : '',
      disabled ? 'opacity-25' : 'hover:bg-gray-700/15 active:bg-gray-700/20',
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
