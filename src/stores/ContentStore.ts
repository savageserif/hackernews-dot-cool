import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import type { HackerNewsCategory, HackerNewsItemData, HackerNewsItem } from '@/types';
import { categoryNames, apiCategoryUrl, apiItemUrl, parseUrl } from '@/utils';

export const useContentStore = defineStore('content', () => {
  // currently selected category
  const currentCategory = useStorage<HackerNewsCategory>('currentCategory', 'top');
  const currentCategoryName = computed(() => categoryNames[currentCategory.value]);

  // post IDs for each category
  const postIds = ref<{
    [key in HackerNewsCategory]?: {
      ids: number[];
      timestamp: number;
      error: null | unknown;
      isLoading: boolean;
    };
  }>({});

  // post items for each category
  const postItems = ref<{
    [key in HackerNewsCategory]?: {
      items: HackerNewsItem[];
      error: null | unknown;
      isLoading: boolean;
    };
  }>({});

  // post IDs and items of currently selected category
  const currentCategoryPostIds = computed(() => postIds.value[currentCategory.value]);
  const currentCategoryPostItems = computed(() => postItems.value[currentCategory.value]);

  // whether some post items of currently selected category have been fetched
  const currentCategoryHasSomePostItems = computed(
    () => currentCategoryPostItems.value?.items && currentCategoryPostItems.value?.items.length > 0
  );

  // whether all post items of currently selected category have been fetched
  const currentCategoryHasAllPostItems = computed(
    () =>
      currentCategoryPostIds.value?.ids &&
      currentCategoryPostItems.value?.items &&
      currentCategoryPostItems.value?.items.length === currentCategoryPostIds.value?.ids.length
  );

  // fetch post IDs from API for a specific category
  async function fetchPostIds(category: HackerNewsCategory = currentCategory.value) {
    // remove old post items for selected category in case they exist
    postItems.value[category] = undefined;

    postIds.value[currentCategory.value] = {
      ids: [],
      timestamp: Date.now(),
      error: null,
      isLoading: true,
    };

    try {
      const fetchedIds: number[] = await fetch(apiCategoryUrl(category)).then((response) =>
        response.json()
      );

      postIds.value[category]!.ids.push(...fetchedIds);
      postIds.value[category]!.isLoading = false;

      fetchPostItems();
    } catch (error) {
      postIds.value[category]!.error = error;
      postIds.value[category]!.isLoading = false;
    }
  }

  // fetch item details for a specific post ID
  async function fetchPostItem(id: number) {
    const fetchedItem: HackerNewsItemData = await fetch(apiItemUrl(id)).then((response) =>
      response.json()
    );

    const postItem: HackerNewsItem = Object.assign({}, fetchedItem, {
      url: fetchedItem.url ? parseUrl(fetchedItem.url) : undefined,
    });

    return postItem;
  }

  // fetch a new set of post items from a specific category’s array of post IDs
  async function fetchPostItems(category: HackerNewsCategory = currentCategory.value) {
    if (postItems.value[category] === undefined) {
      postItems.value[category] = {
        items: [],
        error: null,
        isLoading: true,
      };
    } else {
      if (postItems.value[category]!.isLoading) return;
      postItems.value[category]!.isLoading = true;
    }

    const currentPostCount = postItems.value[category]!.items.length;
    const newPostCount = currentPostCount + 30;

    try {
      const fetchedItems: HackerNewsItem[] = await Promise.all(
        // slice the array of post IDs to select set of post items following those already fetched previously
        postIds.value[category]!.ids.slice(currentPostCount, newPostCount).map(fetchPostItem)
      );

      postItems.value[category]!.items.push(...fetchedItems);
      postItems.value[category]!.isLoading = false;
    } catch (error) {
      postItems.value[category]!.error = error;
      postItems.value[category]!.isLoading = false;
    }
  }

  // current post item whose value gets copied/replaced from postItems
  const currentPostItem = ref<HackerNewsItem | undefined>(undefined);

  // set a new current post item
  function setCurrentPostItem(postItem: HackerNewsItem) {
    currentPostItem.value = postItem;
  }

  // IDs of posts that have previously been viewed
  const viewedPostIds = useStorage<number[]>('viewedPostIds', []);

  // mark a post as viewed when it becomes the current post item
  watch(
    () => currentPostItem.value,
    () => {
      if (!viewedPostIds.value.includes(currentPostItem.value!.id)) {
        viewedPostIds.value.push(currentPostItem.value!.id);
      }
    }
  );

  return {
    currentCategory,
    currentCategoryName,
    postIds,
    postItems,
    currentCategoryPostIds,
    currentCategoryPostItems,
    currentCategoryHasSomePostItems,
    currentCategoryHasAllPostItems,
    fetchPostIds,
    fetchPostItem,
    fetchPostItems,
    currentPostItem,
    setCurrentPostItem,
    viewedPostIds,
  };
});
