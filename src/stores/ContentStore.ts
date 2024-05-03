import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { HackerNewsItem } from '@/types';

export const useContentStore = defineStore('content', () => {
  const currentItem = ref<HackerNewsItem>({
    by: 'scop',
    id: 38571088,
    descendants: 81,
    kids: [
      38571580, 38573214, 38573480, 38572058, 38572193, 38572010, 38571442, 38571862, 38580518,
      38572927, 38575237, 38571465, 38571514, 38571718, 38572441, 38575227, 38571939, 38574618,
      38573303, 38574532, 38573630, 38571630, 38590209, 38572917,
    ],
    score: 166,
    time: 1702054197,
    title: 'iA Writer in Paper',
    type: 'story',
    url: new URL('https://ia.net/topics/ia-writer-in-paper'),
  });

  return {
    currentItem,
  };
});
