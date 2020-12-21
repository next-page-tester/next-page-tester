import { URL } from 'url';
import { useRef, useEffect, useCallback } from 'react';
import querystring from 'querystring';
import findRoot from 'find-root';
import { existsSync } from 'fs';
import loadConfig from 'next/dist/next-server/server/config';
import { setConfig } from 'next/dist/next-server/lib/runtime-config';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import path from 'path';

type NextConfig = {
  serverRuntimeConfig?: object;
  publicRuntimeConfig?: object;
  pageExtensions?: Array<string>;
};

export function parseRoute({ route }: { route: string }) {
  const urlObject = new URL(`http://test.com${route}`);
  let { pathname } = urlObject;

  /*
   * Next.js redirects by default routes with trailing slash to the counterpart without trailing slash
   * @NOTE: Here we might handle Next.js trailingSlash option
   * https://nextjs.org/docs/api-reference/next.config.js/trailing-slash
   */
  if (pathname.endsWith('/') && pathname !== '/') {
    urlObject.pathname = pathname.slice(0, -1);
  }

  return urlObject;
}

export function parseQueryString({
  queryString,
}: {
  queryString: string;
}): querystring.ParsedUrlQuery {
  const qs = queryString.startsWith('?')
    ? queryString.substring(1)
    : queryString;

  return querystring.parse(qs);
}

export function stringifyQueryString({
  object,
  leadingQuestionMark,
}: {
  object: Parameters<typeof querystring['stringify']>[0];
  leadingQuestionMark?: boolean;
}): string {
  const queryString = querystring.stringify(object);
  if (leadingQuestionMark && queryString) {
    return '?' + queryString;
  }
  return queryString;
}

export function removeFileExtension({ path }: { path: string }) {
  return path.replace(/\.[^/.]+$/, '');
}

export const defaultNextRoot = findRoot(process.cwd());

export function findPagesDirectory({ nextRoot }: { nextRoot: string }) {
  const pagesPaths = [
    path.join(nextRoot, 'pages'),
    path.join(nextRoot, 'src', 'pages'),
  ];
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
export function getNextConfig({ pathToConfig }: { pathToConfig: string }) {
  return loadConfig(PHASE_DEVELOPMENT_SERVER, pathToConfig);
}

/**
 * Set the Next.js runtime config.
 */
export function setNextRuntimeConfig({
  nextConfig,
}: {
  nextConfig: NextConfig;
}) {
  const runtimeConfig = {
    publicRuntimeConfig: nextConfig.publicRuntimeConfig || {},
  };

  Object.defineProperty(runtimeConfig, 'serverRuntimeConfig', {
    get: () =>
      typeof window !== 'undefined' ? {} : nextConfig.serverRuntimeConfig || {},
  });

  setConfig(runtimeConfig);
}

export function getPageExtensions({
  nextConfig,
}: {
  nextConfig: NextConfig;
}): string[] {
  const { pageExtensions } = nextConfig as { pageExtensions: string[] };
  return pageExtensions;
}

export function useMountedState(): () => boolean {
  const mountedRef = useRef(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  });

  return get;
}
