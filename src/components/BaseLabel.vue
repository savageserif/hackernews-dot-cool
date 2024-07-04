<template>
  <div
    class="flex items-center gap-1 truncate"
    :class="[reversed ? 'flex-row-reverse' : '']"
  >
    <BaseIcon
      v-if="icon"
      :name="icon"
      :small="small"
      :inherit-color="inheritColor"
      class="flex-none"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue';

const props = defineProps<{
  icon?: string;
  small?: boolean;
  reversed?: boolean;
  inheritColor?: boolean;
}>();
</script>
