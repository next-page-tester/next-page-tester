import { Fragment } from 'react';
import type { AppContext, AppInitialProps } from 'next/app';
import makeRouterMock from '../makeRouterMock';
import { makeGetInitialPropsContext } from '../fetchData/makeContextObject';
import { executeAsIfOnServer } from '../server';
import type { PageObject, ExtendedOptions } from '../commonTypes';

export default async function fetchAppData({
  pageObject,
  options,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
}): Promise<AppInitialProps | undefined> {
  const { env } = options;
  const { appFile } = pageObject;
  const AppComponent = appFile[env].default;

  const { getInitialProps } = AppComponent;
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
      // @ts-expect-error incomplete router object
      router: { asPath, pathname, query, route, basePath },
    };

    const appInitialProps =
      env === 'server'
        ? await executeAsIfOnServer(() => getInitialProps(ctx))
        : await getInitialProps(ctx);

    return appInitialProps;
  }
}
