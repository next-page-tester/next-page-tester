import React from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { parseRoute } from './utils';

// https://github.com/vercel/next.js/issues/7479#issuecomment-659859682
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

export default function preparePage({
  pageElement,
  pageObject: { pagePath, params, route },
}) {
  const { pathname } = parseRoute(route);
  return React.createElement(
    RouterContext.Provider,
    {
      value: {
        ...routerMock,
        // @TODO review these values
        pathname: pagePath,
        asPath: pathname,
        query: params,
      },
    },
    pageElement
  );
}
