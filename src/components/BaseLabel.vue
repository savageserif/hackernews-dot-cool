<template>
  <div
    class="flex items-center gap-1"
    :class="[reversed ? 'flex-row-reverse' : '']"
  >
    <BaseIcon
      v-if="icon"
      :name="icon"
      :small="small"
      :inherit-color="inheritColor"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue';

const props = defineProps<{
  icon?: string;
  small?: boolean;
  inheritColor?: boolean;
  reversed?: boolean;
}>();
</script>
