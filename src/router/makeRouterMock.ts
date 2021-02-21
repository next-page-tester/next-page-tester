import { createRouter, NextRouter } from 'next/router';
import { removeFileExtension, parseRoute } from '../utils';
import type { ExtendedOptions, PageObject } from '../commonTypes';

type NextPushArgs = Parameters<NextRouter['push']>;

export type PushHandler = (
  url: NextPushArgs[0],
  as: NextPushArgs[1],
  options: NextPushArgs[2]
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
  };

  return routerMock;
}

let SingletonRouter: NextRouter;

export default function makeRouterMock({
  options: { router: routerEnhancer },
  pageObject: { pagePath, params, route, query },
  pushHandler,
}: {
  options: ExtendedOptions;
  pageObject: PageObject;
  pushHandler?: PushHandler;
}): NextRouter {
  const { pathname, search, hash } = parseRoute({ route });
  const router = {
    ...makeDefaultRouterMock({ pushHandler }),
    asPath: pathname + search + hash, // Includes querystring and anchor
    pathname: removeFileExtension({ path: pagePath }), // Page component path without extension
    query: { ...params, ...query }, // Route params + parsed querystring
    route: removeFileExtension({ path: pagePath }), // Page component path without extension
    basePath: '',
  };

  SingletonRouter = routerEnhancer(router);
  // @ts-expect-error we are calling this just to execute the initialization of singletonRouter which we
  // intercept and assign to our mocked router
  createRouter();
  return SingletonRouter;
}

jest.mock('next/dist/next-server/lib/router/router', () => ({
  __esModule: true,
  ...jest.requireActual<Record<string, unknown>>(
    'next/dist/next-server/lib/router/router'
  ),
  default: Object.assign(
    function () {
      return SingletonRouter;
    },
    {
      events: {
        on: () => {},
        off: () => {},
        emit: () => {},
      },
    }
  ),
}));
