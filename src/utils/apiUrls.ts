import type { HackerNewsCategory } from '@/types';

const apiBaseUrl = 'https://hacker-news.firebaseio.com/v0/';

export function apiCategoryUrl(category: HackerNewsCategory) {
  return apiBaseUrl + category + 'stories.json';
}

export function apiItemUrl(id: number) {
  return apiBaseUrl + 'item/' + id + '.json';
}
