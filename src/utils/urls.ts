const apiBaseUrl = 'https://hacker-news.firebaseio.com/v0/';
const hackerwebApiBaseUrl = 'https://api.hackerwebapp.com/';

export function apiCategoryUrl(category: HackerNewsCategory) {
  return apiBaseUrl + category + 'stories.json';
}

export function apiItemUrl(id: number) {
  return apiBaseUrl + 'item/' + id + '.json';
}

export function hackerwebApiItemUrl(id: number) {
  return hackerwebApiBaseUrl + 'item/' + id;
}

export function parsePostUrl(url: string) {
  const parsedUrl = new URL(url);

  const customUrl = {
    hostname: parsedUrl.hostname,
    highlightedPathname: '',
    pathname: parsedUrl.pathname,
    href: parsedUrl.href,
    search: parsedUrl.search,
  };

  customUrl.hostname = customUrl.hostname.replace(/^www\./g, '');

  if (customUrl.hostname === 'github.com') {
    customUrl.highlightedPathname = '/' + customUrl.pathname.split('/')[1];
    customUrl.pathname = '/' + customUrl.pathname.split('/').slice(2).join('/');
  }

  if (customUrl.pathname.endsWith('/')) {
    customUrl.pathname = customUrl.pathname.substring(0, customUrl.pathname.length - 1);
  }

  return customUrl;
}
