import React from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { parseRoute, removeFileExtension } from './utils';

// https://github.com/vercel/next.js/issues/7479#issuecomment-659859682
function makeDefaultRouterMock(props) {
  const routerMock = {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push: () => {},
    replace: () => {},
    reload: () => {},
    back: () => {},
    prefetch: () => {},
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
}) {
  const { pathname, search } = parseRoute({ route });
  return React.createElement(
    RouterContext.Provider,
    {
      value: routerMocker(
        makeDefaultRouterMock({
          asPath: pathname + search, // Includes querystring and anchor
          pathname: removeFileExtension({ path: pagePath }), // Page component path without extension
          query: params, // Route params + parsed querystring
          route: removeFileExtension({ path: pagePath }), // Page component path without extension
        })
      ),
    },
    pageElement
  );
}
