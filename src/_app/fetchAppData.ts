import { Fragment } from 'react';
import type { AppContext, AppInitialProps } from 'next/app';
import makeRouterMock from '../makeRouterMock';
import { makeGetInitialPropsContext } from '../fetchData/makeContextObject';
import getCustomAppFile from './getCustomAppFile';
import { executeAsIfOnServer } from '../server';
import type { PageObject, ExtendedOptions } from '../commonTypes';

export default async function fetchAppData({
  pageObject,
  options,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
}): Promise<AppInitialProps | undefined> {
  const { useApp, isClientSideNavigation } = options;
  const customAppFile = getCustomAppFile({ options });

  if (!useApp || !customAppFile) {
    return;
  }

  const customApp = isClientSideNavigation
    ? customAppFile.client.default
    : customAppFile.server.default;
  const { getInitialProps } = customApp;

  if (getInitialProps) {
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

    const appInitialProps = isClientSideNavigation
      ? await getInitialProps(ctx)
      : await executeAsIfOnServer(() => getInitialProps(ctx));

    return appInitialProps;
  }
}
