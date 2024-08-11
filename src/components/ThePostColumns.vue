<template>
  <ThePrimaryColumn
    v-show="view.availableColumns >= 2 || route.name === 'post'"
    class="min-w-90"
    :class="primaryColumnFlex"
  />
  <TheSecondaryColumn
    v-if="content.currentPostItemHasLinkAndComments && view.availableColumns === 3"
    v-show="view.secondaryColumn.isOpen"
    class="min-w-90"
    :class="secondaryColumnFlex"
  />
</template>

<script setup lang="ts">
const view = useViewStore();
const content = useContentStore();
const router = useRouter();
const route = useRoute();

const props = defineProps<{
  postId: number;
}>();

// flex classes for primary column
const primaryColumnFlex = computed(() => {
  if (view.availableColumns <= 2 || !view.secondaryColumn.isOpen) {
    return 'flex-1';
  }

  if (view.prioritizedView === 'link') {
    if (
      view.secondaryColumn.isExpandable &&
      view.secondaryColumn.isExpanded &&
      view.windowWidth < 1322
    ) {
      return 'flex-none basis-90';
    } else {
      return 'flex-1';
    }
  } else {
    if (!view.secondaryColumn.isExpandable && view.windowWidth < 1322) {
      return 'flex-1';
    } else if (view.secondaryColumn.isExpandable && view.secondaryColumn.isExpanded) {
      return 'flex-none basis-150';
    } else {
      return 'grow basis-150';
    }
  }
});

// flex classes for secondary column
const secondaryColumnFlex = computed(() => {
  if (view.prioritizedView === 'link') {
    if (view.secondaryColumn.isExpandable && view.secondaryColumn.isExpanded) {
      return view.windowWidth < 1322 ? 'flex-1' : 'flex-none basis-150';
    } else {
      return 'flex-none basis-90';
    }
  } else {
    if (view.secondaryColumn.isExpandable && view.secondaryColumn.isExpanded) {
      return 'flex-1';
    } else {
      return view.windowWidth < 1322 ? 'flex-none basis-90' : 'grow basis-90';
    }
  }
});

// whenever the postId prop changes thorugh router, update the current post item
watch(
  () => props.postId,
  async () => {
    const postItem = content.currentCategoryPostItems?.items.find(
      (postItem) => postItem.id === props.postId
    );

    if (postItem) {
      content.setCurrentPostItem(postItem);
    } else {
      const fetchedPostItem = await content.fetchPostItem(props.postId);

      // if post item cannot be fetched, return to no selection route, replacing the current history entry
      if (fetchedPostItem === null) {
        router.replace({ name: 'no-selection' });
        return;
      }

      content.setCurrentPostItem(fetchedPostItem);
    }
  },
  { immediate: true }
);
</script>
