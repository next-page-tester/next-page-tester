import { URL } from 'url';
import { useRef, useEffect } from 'react';
import querystring from 'querystring';
import findRoot from 'find-root';
import { existsSync } from 'fs';
import loadConfig from 'next/dist/next-server/server/config';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

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
    `[next page tester] Cannot find "pages" directory under: ${nextRoot}`
  );
}

/*
 * Retrieve Next.js config using Next.js internals
 * https://github.com/vercel/next.js/blob/v10.0.1/test/isolated/config.test.js#L12
 *
 * Default config:
 * https://github.com/vercel/next.js/blob/canary/packages/next/next-server/server/config.ts
 */
function getNextConfig({ pathToConfig }: { pathToConfig: string }) {
  return loadConfig(PHASE_DEVELOPMENT_SERVER, pathToConfig);
}

export function getPageExtensions({
  nextRoot,
}: {
  nextRoot: string;
}): string[] {
  const config = getNextConfig({ pathToConfig: nextRoot });
  const { pageExtensions } = config as { pageExtensions: string[] };
  return pageExtensions;
}

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    effect();
  }, deps);
};
