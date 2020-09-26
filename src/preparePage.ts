import React, { ReactNode } from 'react';
import queryString from 'query-string';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import { parseRoute, removeFileExtension } from './utils';
import type { Options, PageObject } from './commonTypes';

// https://github.com/vercel/next.js/issues/7479#issuecomment-659859682
function makeDefaultRouterMock(props = {}): NextRouter {
  const routerMock = {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push: async () => true,
    replace: async () => true,
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

  return { ...routerMock, ...props };
}

export default function preparePage({
  pageElement,
  pageObject: { pagePath, params, route },
  routerMocker,
}: {
  pageElement: ReactNode;
  pageObject: PageObject;
  routerMocker: Exclude<Options['router'], undefined>;
}) {
  const { pathname, search, hash } = parseRoute({ route });
  return React.createElement(
    RouterContext.Provider,
    {
      value: routerMocker(
        makeDefaultRouterMock({
          asPath: pathname + search + hash, // Includes querystring and anchor
          pathname: removeFileExtension({ path: pagePath }), // Page component path without extension
          query: { ...params, ...queryString.parse(search) }, // Route params + parsed querystring
          route: removeFileExtension({ path: pagePath }), // Page component path without extension
        })
      ),
    },
    pageElement
  );
}
