<template>
  <PageColumnBody
    ref="containerElement"
    class="space-y-px"
  >
    <PostsListItem
      v-for="(postItem, index) in content.currentCategoryPostItems?.items"
      :key="index"
      :item="postItem"
      :viewed="content.viewedPostIds.includes(postItem.id)"
      :active="route.name === 'post' && postItem.id === content.currentPostItem?.id"
      @click="router.push({ name: 'post', params: { postId: postItem.id } })"
    />
    <StatusItem
      :full-height="!content.currentCategoryHasSomePostItems"
      :message="statusMessage"
    />
  </PageColumnBody>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useInfiniteScroll } from '@vueuse/core';
import PageColumnBody from '@/components/PageColumnBody.vue';
import PostsListItem from '@/components/PostsListItem.vue';
import StatusItem from '@/components/StatusItem.vue';
import { useContentStore } from '@/stores/ContentStore';

const router = useRouter();
const route = useRoute();
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

const statusMessage = computed(() => {
  if (content.currentCategoryHasAllPostItems)
    return `You have browsed all “${content.currentCategoryName.replace(' ', '&nbsp;')}” entries. Refresh the list to view newer posts.`;
  else if (content.currentCategoryPostIds?.error)
    return `An error has occurred while loading stories (${content.currentCategoryPostIds.error}).`;
  else return undefined;
});
</script>
