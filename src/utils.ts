import type { HackerNewsCategory } from '@/types';

export const categoryNames: { [key in HackerNewsCategory]: string } = {
  top: 'Top Stories',
  new: 'New Stories',
  best: 'Best Stories',
  ask: 'Ask HN',
  show: 'Show HN',
};

const apiBaseUrl = 'https://hacker-news.firebaseio.com/v0/';

export function apiCategoryUrl(category: HackerNewsCategory) {
  return apiBaseUrl + category + 'stories.json';
}

export function apiItemUrl(id: number) {
  return apiBaseUrl + 'item/' + id + '.json';
}

export function parseUrl(url: string) {
  const parsedUrl = new URL(url);
  parsedUrl.hostname = parsedUrl.hostname.replace(/^www\./g, '');
  return parsedUrl;
}
