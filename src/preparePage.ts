import React, { ReactNode } from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import makeRouterObject from './makeRouterObject';
import getCustomAppFile from './getCustomAppFile';
import type { OptionsWithDefaults, PageObject, PageData } from './commonTypes';

// https://github.com/vercel/next.js/issues/7479#issuecomment-659859682
function makeDefaultRouterMock(props?: Partial<NextRouter>): NextRouter {
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

  return { ...routerMock, ...props };
}

export default async function preparePage({
  pageObject,
  pageData,
  options,
}: {
  pageObject: PageObject;
  pageData: PageData;
  options: OptionsWithDefaults;
}): Promise<ReactNode> {
  const { page } = pageObject;
  const { props } = pageData;
  const { router: routerMocker, customApp } = options;

  // Render page element
  let pageElement = React.createElement(page.default, props);

  // Optionally wrap with custom App
  if (customApp) {
    const customAppFile = await getCustomAppFile({ options });
    if (customAppFile) {
      pageElement = React.createElement(customAppFile.default, {
        Component: page.default,
        pageProps: props,
      });
    }
  }

  // Wrap with RouterContext provider
  const { asPath, pathname, query, route } = makeRouterObject({ pageObject });
  return React.createElement(
    RouterContext.Provider,
    {
      value: routerMocker(
        makeDefaultRouterMock({
          asPath,
          pathname,
          query,
          route,
        })
      ),
    },
    pageElement
  );
}
