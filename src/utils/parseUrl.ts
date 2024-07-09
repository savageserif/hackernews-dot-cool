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
