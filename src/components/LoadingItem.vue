<template>
  <div
    class="flex flex-col items-center justify-center pb-[1.1875rem] pt-[1.0625rem]"
    :class="[!content.currentCategoryHasSomePostItems ? 'h-full' : '']"
  >
    <BaseIcon
      v-if="!content.currentCategoryHasAllPostItems"
      name="loading"
      class="animate-step"
    />
    <span
      v-else
      class="mx-10 text-balance text-center text-small text-gray-500"
    >
      You have browsed all “{{ content.currentCategoryName.replace(' ', '&nbsp;') }}” entries.
      Refresh the list to view newer posts.
    </span>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();
</script>
