import { Fragment } from 'react';
import type { AppContext, AppInitialProps } from 'next/app';
import makeRouterObject from '../makeRouterObject';
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
    const ctx: AppContext = {
      // @NOTE AppTree is currently just a stub
      AppTree: Fragment,
      Component: pageObject.page.default,
      ctx: makeGetInitialPropsContext({ pageObject, options }),
      // @ts-ignore: Incomplete router object
      router: makeRouterObject({ pageObject }),
    };

    const appInitialProps = await customApp.getInitialProps(ctx);
    return appInitialProps;
  }
}
