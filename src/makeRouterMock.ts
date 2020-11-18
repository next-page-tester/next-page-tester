import type { NextRouter } from 'next/router';
import { removeFileExtension, parseRoute } from './utils';
import type { PageObject } from './commonTypes';

// https://github.com/vercel/next.js/issues/7479#issuecomment-659859682
function makeDefaultRouterMock(): NextRouter {
  const routerMock = {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push: /* istanbul ignore next */ async () => true,
    replace: /* istanbul ignore next */ async () => true,
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

export default function makeRouterMock({
  pageObject: { pagePath, params, route, query },
}: {
  pageObject: PageObject;
}): NextRouter {
  const { pathname, search, hash } = parseRoute({ route });
  const defaultRouterMock = makeDefaultRouterMock();
  return {
    ...defaultRouterMock,
    asPath: pathname + search + hash, // Includes querystring and anchor
    pathname: removeFileExtension({ path: pagePath }), // Page component path without extension
    query: { ...params, ...query }, // Route params + parsed querystring
    route: removeFileExtension({ path: pagePath }), // Page component path without extension
    basePath: '',
  };
}
