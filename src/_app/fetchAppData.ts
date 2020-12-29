import { Fragment } from 'react';
import type { AppContext, AppInitialProps } from 'next/app';
import makeRouterMock from '../makeRouterMock';
import { makeGetInitialPropsContext } from '../fetchData/makeContextObject';
import getCustomAppFile from './getCustomAppFile';
import type { PageObject, ExtendedOptions } from '../commonTypes';

export default async function fetchAppData({
  pageObject,
  options,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
}): Promise<AppInitialProps | undefined> {
  const { useApp } = options;
  const customAppFile = getCustomAppFile({ options });

  if (!useApp || !customAppFile) {
    return;
  }

  const customApp = customAppFile.server.default;
  if (customApp.getInitialProps) {
    const { asPath, pathname, query, route, basePath } = makeRouterMock({
      options,
      pageObject,
    });

    const ctx: AppContext = {
      // @NOTE AppTree is currently just a stub
      AppTree: Fragment,
      Component: pageObject.page.client.default,
      ctx: makeGetInitialPropsContext({
        pageObject,
        options,
      }),
      // @ts-ignore: Incomplete router object
      router: { asPath, pathname, query, route, basePath },
    };

    const appInitialProps = await customApp.getInitialProps(ctx);
    return appInitialProps;
  }
}
