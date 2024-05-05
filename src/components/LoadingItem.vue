<template>
  <div
    v-if="!content.currentCategoryHasAllPostItems"
    class="flex items-center justify-center"
    :class="[content.currentCategoryHasSomePostItems ? 'h-[3.75rem]' : 'h-full']"
  >
    <BaseIcon
      name="loading"
      class="animate-step mb-0.5"
    />
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();
</script>
