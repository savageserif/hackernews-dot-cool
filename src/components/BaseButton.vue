<template>
  <button
    class="flex items-center rounded ring-focus-color ring-offset-1 ring-offset-controls-color transition-[background-color,border-color] duration-200 hover:duration-0 focus:outline-none focus-visible:ring-2"
    :class="[
      small
        ? view.isTouchDevice
          ? 'h-8 p-1.5'
          : 'h-6 p-0.5'
        : view.isTouchDevice
          ? 'h-10 p-1.5'
          : 'h-8 p-1',
      $slots.default && !icon ? (view.isTouchDevice ? 'px-2.5' : 'px-2') : '',
      $slots.default && icon && !reversed ? (view.isTouchDevice ? 'pr-2.5' : 'pr-2') : '',
      $slots.default && icon && reversed && small ? (view.isTouchDevice ? 'pl-2' : 'pl-1.5') : '',
      bordered
        ? 'rounded-outline border border-separator-color active:border-primary-color/10'
        : '',
      bordered && !view.isTouchDevice ? 'hover:border-primary-color/10' : '',
      disabled ? 'opacity-25' : 'active:bg-primary-color/15',
      !disabled && !view.isTouchDevice ? 'hover:bg-primary-color/10' : '',
    ]"
    :disabled="disabled"
  >
    <BaseLabel
      :icon="icon"
      :small="small"
      :reversed="reversed"
      :class="labelClass"
      :style="labelStyle"
    >
      <slot />
    </BaseLabel>
  </button>
</template>

<script setup lang="ts">
import { useViewStore } from '@/stores/ViewStore';

const view = useViewStore();

const props = defineProps<{
  icon?: string;
  small?: boolean;
  reversed?: boolean;
  bordered?: boolean;
  disabled?: boolean;
  labelClass?: string;
  labelStyle?: string;
}>();
</script>
