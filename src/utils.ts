import { URL } from 'url';
import querystring from 'querystring';
import findRoot from 'find-root';
import { existsSync } from 'fs';

export function parseRoute({ route }: { route: string }) {
  return new URL(`http://test.com${route}`);
}

export function parseQueryString({ queryString }: { queryString: string }) {
  const qs = queryString.startsWith('?')
    ? queryString.substring(1)
    : queryString;

  return querystring.parse(qs);
}

export function removeFileExtension({ path }: { path: string }) {
  return path.replace(/\.[^/.]+$/, '');
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function stringify(entity: any): string {
  return JSON.stringify(entity, null, ' ');
}

export const defaultNextRoot = findRoot(process.cwd());

export function findPagesDirectory({ nextRoot }: { nextRoot: string }) {
  const pagesPaths = [`${nextRoot}/pages`, `${nextRoot}/src/pages`];
  for (const path of pagesPaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new Error(
    `[next page tester] cannot find "pages" directory under: ${nextRoot}`
  );
}
