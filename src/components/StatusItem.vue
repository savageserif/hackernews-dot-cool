<template>
  <div
    class="flex flex-col items-center justify-center pb-[1.1875rem] pt-[1.0625rem]"
    :class="[fullHeight ? 'h-full' : '']"
  >
    <span
      v-if="message"
      class="mx-10 text-balance text-center text-small text-secondary-color"
      v-html="message"
    />
    <BaseIcon
      v-else
      name="loading"
      class="animate-step"
    />
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue';

const props = defineProps<{
  fullHeight?: boolean;
  message?: string;
}>();
</script>
