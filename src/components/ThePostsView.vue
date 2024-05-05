<template>
  <PageColumnBody
    ref="containerElement"
    class="space-y-px"
  >
    <PostItem
      v-for="(postItem, index) in content.currentCategoryPostItems?.items"
      :key="index"
      :item="postItem"
      :viewed="content.viewedPostIds.includes(postItem.id)"
      :active="postItem.id === content.currentPostItem?.id"
      @click="content.setCurrentPostItem(postItem)"
    />
    <LoadingItem />
  </PageColumnBody>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import PageColumnBody from '@/components/PageColumnBody.vue';
import PostItem from '@/components/PostItem.vue';
import LoadingItem from '@/components/LoadingItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const content = useContentStore();

const containerElement = ref<HTMLElement | null>(null);

onMounted(() => {
  useInfiniteScroll(
    containerElement,
    () => {
      if (content.currentCategoryHasSomePostItems && !content.currentCategoryHasAllPostItems) {
        content.fetchPostItems();
      }
    },
    { distance: 60 }
  );
});
</script>
