import type { HackerNewsCategory } from '@/types';

const apiBaseUrl = 'https://hacker-news.firebaseio.com/v0/';

export function apiCategoryUrl(category: HackerNewsCategory) {
  return apiBaseUrl + category + 'stories.json';
}

export function apiItemUrl(id: number) {
  return apiBaseUrl + 'item/' + id + '.json';
}

export function parseUrl(url: string) {
  const parsedUrl = new URL(url);

  const customUrl = {
    hostname: parsedUrl.hostname,
    pathname: parsedUrl.pathname,
    href: parsedUrl.href,
    search: parsedUrl.search,
  };

  customUrl.hostname = customUrl.hostname.replace(/^www\./g, '');

  if (customUrl.hostname === 'github.com') {
    customUrl.hostname = customUrl.hostname + '/' + customUrl.pathname.split('/')[1];
    customUrl.pathname = '/' + customUrl.pathname.split('/').slice(2).join('/');
  }

  if (customUrl.pathname.endsWith('/')) {
    customUrl.pathname = customUrl.pathname.substring(0, customUrl.pathname.length - 1);
  }

  return customUrl;
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
