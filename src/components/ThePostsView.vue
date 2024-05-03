<template>
  <div class="space-y-px">
    <PostItem :item="content.currentItem" />
    <PostItem
      :item="content.currentItem"
      active
    />
    <PostItem
      :item="content.currentItem"
      viewed
    />
    <PostItem :item="content.currentItem" />
  </div>
</template>

<script setup lang="ts">
import PostItem from '@/components/PostItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();
</script>
