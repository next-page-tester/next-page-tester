import { URL } from 'url';
import { useRef, useEffect, useCallback } from 'react';
import querystring from 'querystring';
import findRoot from 'find-root';
import { existsSync } from 'fs';
import path from 'path';
import stealthyRequire from 'stealthy-require';
import tinyGlob from 'tiny-glob';
import normalizePath from 'normalize-path';
import { getNextConfig } from './nextConfig';
import { InternalError } from './_error';
import { normalizeLocalePath } from 'next/dist/shared/lib/i18n/normalize-locale-path';
import type { PageObject } from './commonTypes';

export function parseRoute({
  route,
}: {
  route: string;
}): {
  urlObject: URL;
  detectedLocale: string | undefined;
} {
  const { i18n } = getNextConfig();
  const locales = i18n?.locales;
  const urlObject = new URL(`http://test.com${route}`);
  const { pathname: localePath } = urlObject;
  const { pathname, detectedLocale } = normalizeLocalePath(localePath, locales);
  urlObject.pathname = pathname;

  /*
   * Next.js redirects by default routes with trailing slash to the counterpart without trailing slash
   * @NOTE: Here we might handle Next.js trailingSlash option
   * https://nextjs.org/docs/api-reference/next.config.js/trailing-slash
   */
  if (pathname.endsWith('/') && pathname !== '/') {
    urlObject.pathname = pathname.slice(0, -1);
  }

  return { urlObject, detectedLocale };
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

export function removeFileExtension({ path }: { path: string }): string {
  return path.replace(/\.[^/.]+$/, '');
}

export const defaultNextRoot = findRoot(process.cwd());

export function findPagesDirectory({ nextRoot }: { nextRoot: string }): string {
  const pagesPaths = [
    path.join(nextRoot, 'pages'),
    path.join(nextRoot, 'src', 'pages'),
  ];
  for (const path of pagesPaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  throw new InternalError(`Cannot find "pages" directory under: ${nextRoot}`);
}

export function getPageExtensions(): string[] {
  const config = getNextConfig();
  return config.pageExtensions as string[];
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

// @NOTE: It is crucial that these modules preserve their identity between client and server
// for document rendering to work correctly. For things to kick in early enough in the process we
// mark them as such in testHelpers.
const predefinedSharedModules = [
  'react',
  'next/dist/shared/lib/head-manager-context',
  'next/dist/shared/lib/router-context',
  'next/dist/shared/lib/runtime-config',
];

function preserveJestSharedModulesIdentity(modules: string[]): void {
  for (const mockModuleName of modules) {
    // @NOTE for some reason Jest needs us to pre-import the modules
    // we want to require with jest.requireActual
    require(mockModuleName);
    jest.mock(mockModuleName, () => jest.requireActual(mockModuleName));
  }
}

export function preservePredefinedSharedModulesIdentity(): void {
  preserveJestSharedModulesIdentity(predefinedSharedModules);
}

export function executeWithFreshModules<T>(
  f: () => T,
  { sharedModules }: { sharedModules: string[] }
): T {
  /* istanbul ignore else */
  if (typeof jest !== 'undefined') {
    let result: T;

    preserveJestSharedModulesIdentity(sharedModules);

    jest.isolateModules(() => {
      result = f();
    });
    // @ts-expect-error result is surely defined here
    return result;
  }
  // @NOTE this branch will never be executed by Jest
  else {
    return stealthyRequire(
      require.cache,
      f,
      () => {
        for (const moduleName of [
          ...predefinedSharedModules,
          ...sharedModules,
        ]) {
          require(moduleName);
        }
      },
      module
    );
  }
}

export function parseHTML(html: string): Document {
  const domParser = new DOMParser();
  return domParser.parseFromString(html, 'text/html');
}

const ABSOLUTE_URL_REGEXP = new RegExp('^(?:[a-z]+:)?//', 'i');

export function isExternalRoute(route: string): boolean {
  return Boolean(route.match(ABSOLUTE_URL_REGEXP));
}

/**
 * Get locale information for a given route
 */
export function getLocales({
  pageObject: { detectedLocale },
}: {
  pageObject: PageObject;
}): {
  locales: string[] | undefined;
  defaultLocale: string | undefined;
  locale: string | undefined;
} {
  const { i18n } = getNextConfig();
  return {
    locales: i18n?.locales,
    defaultLocale: i18n?.defaultLocale,
    locale: detectedLocale || i18n?.defaultLocale,
  };
}

/**
 * Returns the absolute file paths matching a given glob pattern
 * It normalizes both incoming and outcoming paths
 */
export async function glob(pattern: string): Promise<string[]> {
  const paths = await tinyGlob(normalizePath(pattern), { absolute: true });
  return paths.map((path) => normalizePath(path));
}

/**
 * Set next/image configuration as implemented in:
 * https://github.com/vercel/next.js/blob/v11.1.0/packages/next/client/image.tsx#L107
 */
export function setNextImageConfiguration(): void {
  const config = getNextConfig();

  // @ts-expect-error this is how Next.js seems to do
  process.env.__NEXT_IMAGE_OPTS = {
    deviceSizes: config.images?.deviceSizes,
    imageSizes: config.images?.imageSizes,
    path: config.images?.path,
    loader: config.images?.loader,
    domains: config.images?.domains,
  };
}
