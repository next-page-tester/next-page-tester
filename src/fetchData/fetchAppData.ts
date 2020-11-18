import { Fragment } from 'react';
import type { AppContext, AppInitialProps } from 'next/app';
import makeRouterMock from '../makeRouterMock';
import { makeGetInitialPropsContext } from './makeContextObject';
import type {
  NextCustomAppFile,
  PageObject,
  OptionsWithDefaults,
} from '../commonTypes';

export default async function fetchAppData({
  customAppFile,
  pageObject,
  options,
}: {
  customAppFile: NextCustomAppFile;
  pageObject: PageObject;
  options: OptionsWithDefaults;
}): Promise<AppInitialProps | undefined> {
  const customApp = customAppFile.default;
  if (customApp.getInitialProps) {
    const { asPath, pathname, query, route, basePath } = makeRouterMock({
      pageObject,
    });

    const ctx: AppContext = {
      // @NOTE AppTree is currently just a stub
      AppTree: Fragment,
      Component: pageObject.page.default,
      ctx: makeGetInitialPropsContext({ pageObject, options }),
      // @ts-ignore: Incomplete router object
      router: { asPath, pathname, query, route, basePath },
    };

    const appInitialProps = await customApp.getInitialProps(ctx);
    return appInitialProps;
  }
}
