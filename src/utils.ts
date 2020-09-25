const url = require('url');

export function parseRoute({ route }: { route: string }) {
  return url.parse(`http://test.com${route}`);
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function removeFileExtension({ path }: { path: string }) {
  return path.replace(/\.[^/.]+$/, '');
}
