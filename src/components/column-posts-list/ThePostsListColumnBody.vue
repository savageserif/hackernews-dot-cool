<template>
  <PageColumnBody
    ref="containerElement"
    class="space-y-px"
  >
    <PostsListItem
      v-for="(postItem, index) in content.currentCategoryPostItems?.items"
      :key="index"
      :item="postItem"
      :viewed="content.viewedPostIds.has(postItem.id)"
      :active="route.name === 'post' && postItem.id === content.currentPostItem?.id"
      @click="router.push({ name: 'post', params: { postId: postItem.id } })"
    />
    <BaseStatusIndicator
      :full-height="!content.currentCategoryHasSomePostItems"
      :message="statusMessage"
    />
  </PageColumnBody>
</template>

<script setup lang="ts">
const content = useContentStore();
const router = useRouter();
const route = useRoute();

const containerElement = ref<ComponentPublicInstance | null>(null);

onMounted(() => {
  useInfiniteScroll(
    containerElement.value?.$el,
    () => {
      if (content.currentCategoryHasSomePostItems && !content.currentCategoryHasAllPostItems) {
        content.fetchPostItems();
      }
    },
    { distance: 60 }
  );
});

// reset container's scroll position when category is switched
watch(
  () => content.currentCategory,
  () => {
    if (!containerElement.value) return;
    containerElement.value.$el.scrollTop = 0;
  }
);

const statusMessage = computed(() => {
  if (content.currentCategoryHasAllPostItems)
    return `You have browsed all “${content.currentCategoryName.replace(' ', '&nbsp;')}” entries. Refresh the list to view newer posts.`;
  else if (content.currentCategoryPostIds?.error)
    return `An error has occurred while loading stories (${content.currentCategoryPostIds.error}).`;
  else return undefined;
});
</script>
