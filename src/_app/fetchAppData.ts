import { Fragment } from 'react';
import type { AppContext, AppInitialProps } from 'next/app';
import makeRouterMock from '../makeRouterMock';
import { makeGetInitialPropsContext } from '../fetchData/makeContextObject';
import { executeAsIfOnServer } from '../server';
import { PageObject, ExtendedOptions } from '../commonTypes';
import { RuntimeEnvironment } from '../constants';

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
      routeData: pageObject,
      routerEnhancer: options.router,
    });

    const ctx: AppContext = {
      // @NOTE AppTree is currently just a stub
      AppTree: Fragment,
      Component: pageObject.page.client.default,
      ctx: makeGetInitialPropsContext({ pageObject, options }),
      // @ts-expect-error incomplete router object
      router: { asPath, pathname, query, route, basePath },
    };

    const appInitialProps =
      env === RuntimeEnvironment.SERVER
        ? await executeAsIfOnServer(() => getInitialProps(ctx))
        : await getInitialProps(ctx);

    return appInitialProps;
  }
}
