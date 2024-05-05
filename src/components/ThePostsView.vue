<template>
  <PageColumnBody
    class="space-y-px"
  >
    <PostItem
      v-for="(postItem, index) in content.currentCategoryPostItems?.items"
      :key="index"
      :item="postItem"
      :active="postItem.id === content.currentPostItem?.id"
      @click="content.setCurrentPostItem(postItem)"
    />
    <LoadingItem
      v-show="
        content.currentCategoryPostIds?.isLoading || content.currentCategoryPostItems?.isLoading
      "
    />
  </div>
  </PageColumnBody>
</template>

<script setup lang="ts">
import PageColumnBody from '@/components/PageColumnBody.vue';
import PostItem from '@/components/PostItem.vue';
import LoadingItem from '@/components/LoadingItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();
</script>
