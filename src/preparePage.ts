import React from 'react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import makeRouterMock from './makeRouterMock';
import getCustomAppFile from './getCustomAppFile';
import type { ExtendedOptions, PageObject, PageData } from './commonTypes';

export default async function preparePage({
  pageObject,
  pageData,
  options,
}: {
  pageObject: PageObject;
  pageData: PageData;
  options: ExtendedOptions;
}) {
  const { page } = pageObject;
  const { props } = pageData;
  const { router: routerMocker, useCustomApp } = options;

  // Render page element
  let pageElement = React.createElement(page.default, props);

  // Optionally wrap with custom App
  if (useCustomApp) {
    const customAppFile = await getCustomAppFile({ options });
    if (customAppFile) {
      pageElement = React.createElement(customAppFile.default, {
        Component: page.default,
        pageProps: props,
      });
    }
  }

  // Wrap with RouterContext provider
  const routerMock = makeRouterMock({ pageObject });
  return React.createElement(
    RouterContext.Provider,
    {
      value: routerMocker(routerMock),
    },
    pageElement
  );
}
