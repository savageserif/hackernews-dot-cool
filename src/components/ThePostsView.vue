<template>
  <div class="space-y-px">
    <PostItem
      v-for="(postItem, index) in content.currentCategoryPostItems?.items"
      :key="index"
      :item="postItem"
      :active="postItem.id === content.currentPostItem?.id"
      @click="content.setCurrentPostItem(postItem)"
    />
  </div>
</template>

<script setup lang="ts">
import PostItem from '@/components/PostItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();
</script>
