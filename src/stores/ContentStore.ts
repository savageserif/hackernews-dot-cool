import { defineStore } from 'pinia';
import type { HackerNewsCategory, HackerNewsItemData, HackerNewsItem } from '@/types';
import { apiCategoryUrl, apiItemUrl } from '@/utils/apiUrls';
import { parseUrl } from '@/utils/parseUrl';

export const useContentStore = defineStore('content', () => {
  const categoryNames: { [key in HackerNewsCategory]: string } = {
    top: 'Top Stories',
    new: 'New Stories',
    best: 'Best Stories',
    ask: 'Ask HN',
    show: 'Show HN',
  };

  // currently selected category
  const currentCategory = useStorage<HackerNewsCategory>('currentCategory', 'top');
  const currentCategoryName = computed(() => categoryNames[currentCategory.value]);

  // post IDs for each category
  const postIds = ref<{
    [key in HackerNewsCategory]?: {
      ids: number[];
      time: number;
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

    postIds.value[category] = {
      ids: [],
      time: Math.floor(Date.now() / 1000),
      error: null,
      isLoading: true,
    };

    try {
      const response = await fetch(apiCategoryUrl(category));
      if (!response.ok) throw new Error(response.statusText);

      const fetchedIds: number[] = await response.json();
      postIds.value[category]!.ids.push(...fetchedIds);

      fetchPostItems();
    } catch (error) {
      console.error(`Error fetching post IDs for category ${category}:`, error);
      postIds.value[category]!.error = error;
    } finally {
      postIds.value[category]!.isLoading = false;
    }
  }

  // fetch post IDs when the current category changes and IDs for it have not yet been fetched
  watch(
    () => currentCategory.value,
    () => {
      if (currentCategoryPostIds.value === undefined) {
        fetchPostIds();
      }
    }
  );

  // fetch item details for a specific post ID
  async function fetchPostItem(id: number) {
    try {
      const response = await fetch(apiItemUrl(id));
      if (!response.ok) throw new Error(response.statusText);

      const fetchedItem: HackerNewsItemData | null = await response.json();

      // if request returns null or fetched item is not a post, return null
      if (
        fetchedItem === null ||
        fetchedItem.deleted ||
        fetchedItem.dead ||
        !fetchedItem.type ||
        !['story', 'poll', 'job'].includes(fetchedItem.type)
      ) {
        return null;
      }

      // parse URL string of fetched item to separate hostname and pathname
      const postItem: HackerNewsItem = {
        ...fetchedItem,
        url: fetchedItem.url ? parseUrl(fetchedItem.url) : undefined,
      };

      return postItem;
    } catch (error) {
      console.error(`Error fetching post item with ID ${id}:`, error);
      return null;
    }
  }

  // fetch a new set of post items from a specific category’s array of post IDs
  async function fetchPostItems(category: HackerNewsCategory = currentCategory.value) {
    if (postItems.value[category] === undefined) {
      postItems.value[category] = {
        items: [],
        error: null,
        isLoading: true,
      };
    } else if (postItems.value[category]!.isLoading) {
      // return if post items are already being fetched
      return;
    } else {
      postItems.value[category]!.isLoading = true;
    }

    const currentPostCount = postItems.value[category]!.items.length;
    const newPostCount = currentPostCount + 30;

    try {
      const fetchedItems: (HackerNewsItem | null)[] = await Promise.all(
        // slice the array of post IDs to select set of post items following those already fetched previously
        postIds.value[category]!.ids.slice(currentPostCount, newPostCount).map(fetchPostItem)
      );

      const validItems: HackerNewsItem[] = fetchedItems.filter(
        (fetchedItem): fetchedItem is Exclude<typeof fetchedItem, null> => fetchedItem !== null
      );

      postItems.value[category]!.items.push(...validItems);
    } catch (error) {
      console.error(`Error fetching post item data for category ${category}:`, error);
      postItems.value[category]!.error = error;
    } finally {
      postItems.value[category]!.isLoading = false;
    }
  }

  // data of current post item
  const currentPostItem = ref<HackerNewsItem | undefined>(undefined);

  const currentPostItemHasLink = computed(
    () => currentPostItem.value && currentPostItem.value.url !== undefined
  );
  const currentPostItemHasComments = computed(
    () => currentPostItem.value && currentPostItem.value.descendants !== undefined
  );
  const currentPostItemHasLinkAndComments = computed(
    () => currentPostItemHasLink.value && currentPostItemHasComments.value
  );

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
    categoryNames,
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
    currentPostItemHasLink,
    currentPostItemHasComments,
    currentPostItemHasLinkAndComments,
    setCurrentPostItem,
    viewedPostIds,
  };
});
