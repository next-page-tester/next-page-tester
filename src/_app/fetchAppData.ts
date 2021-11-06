import { Fragment } from 'react';
import type { AppContext } from 'next/app';
import { makeGetInitialPropsContext } from '../fetchData/makeContextObject';
import { executeAsIfOnServer } from '../server';
import { PageObject, ExtendedOptions, AppData } from '../commonTypes';
import { RuntimeEnvironment } from '../constants';
import type { Redirect } from 'next';
import { makeRouterMock } from '../router';
import { PushHandler } from '../router/makeRouterMock';

export default async function fetchAppData({
  pageObject,
  options,
  pushHandler,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
  pushHandler?: PushHandler;
}): Promise<AppData> {
  let appRedirect: Redirect | undefined = undefined;
  const { env } = options;
  const { files } = pageObject;
  const AppComponent = files[env].appFile.default;

  const { getInitialProps } = AppComponent;
  if (getInitialProps) {
    const ctx: AppContext = {
      // @NOTE AppTree is currently just a stub
      AppTree: Fragment,
      Component: pageObject.files.client.pageFile.default,
      ctx: makeGetInitialPropsContext({
        pageObject,
        options,
        onRedirect: (redirect) => {
          appRedirect = redirect;
        },
      }),
      // @ts-expect-error incomplete router object
      router: makeRouterMock({ options, pageObject, pushHandler }),
    };

    const appInitialProps =
      env === RuntimeEnvironment.SERVER
        ? await executeAsIfOnServer(() => getInitialProps(ctx))
        : await getInitialProps(ctx);

    if (appRedirect) {
      return { redirect: appRedirect };
    }

    return appInitialProps;
  }
}
