const url = require('url');
import querystring from 'querystring';

export function parseRoute({ route }: { route: string }) {
  return url.parse(`http://test.com${route}`);
}

export function parseQueryString({ queryString }: { queryString?: string }) {
  if (typeof queryString !== 'string') return {};
  const qs = queryString.startsWith('?')
    ? queryString.substring(1)
    : queryString;

  return querystring.parse(qs);
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function removeFileExtension({ path }: { path: string }) {
  return path.replace(/\.[^/.]+$/, '');
}
