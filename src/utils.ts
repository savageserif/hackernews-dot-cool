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

export function formatNumber(number?: number) {
  if (number === undefined) return undefined;
  return new Intl.NumberFormat('gb-GB').format(number);
}

export function absoluteTimestamp(time?: number) {
  if (time === undefined) return undefined;

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(time * 1000);
}
