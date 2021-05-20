import { NextRouter } from 'next/router';
import { removeFileExtension, parseRoute } from '../utils';
import type { ExtendedOptions, PageObject } from '../commonTypes';
import { getNextConfig } from '../nextConfig';

type NextPushArgs = Parameters<NextRouter['push']>;

export type TransitionOptions = NextPushArgs[2];

export type PushHandler = (
  url: NextPushArgs[0],
  as: NextPushArgs[1],
  options: TransitionOptions
) => void;

// https://github.com/vercel/next.js/issues/7479#issuecomment-659859682
function makeDefaultRouterMock({
  pushHandler = () => {},
}: {
  pushHandler?: PushHandler;
}): NextRouter {
  const routerMock: NextRouter = {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push: async (url, as, options) => {
      pushHandler(url, as, options);
      return true;
    },
    replace: async (url, as, options) => {
      pushHandler(url, as, options);
      return true;
    },
    reload: () => {},
    back: () => {},
    prefetch: async () => {},
    beforePopState: () => {},
    events: {
      on: () => {},
      off: () => {},
      emit: () => {},
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
  };

  return routerMock;
}

export default function makeRouterMock({
  options: { router: routerEnhancer },
  pageObject: { pagePath, params, route, query },
  pushHandler,
}: {
  options: ExtendedOptions;
  pageObject: PageObject;
  pushHandler?: PushHandler;
}): NextRouter {
  const { i18n } = getNextConfig();
  const {
    urlObject: { pathname, search, hash },
    detectedLocale,
  } = parseRoute({ route });

  const router: NextRouter = {
    ...makeDefaultRouterMock({ pushHandler }),
    asPath: pathname + search + hash, // Includes querystring and anchor
    pathname: removeFileExtension({ path: pagePath }), // Page component path without extension
    query: { ...params, ...query }, // Route params + parsed querystring
    route: removeFileExtension({ path: pagePath }), // Page component path without extension
    basePath: '',
    locales: i18n?.locales,
    defaultLocale: i18n?.defaultLocale,
    locale: detectedLocale || i18n?.defaultLocale,
  };

  return routerEnhancer(router);
}
