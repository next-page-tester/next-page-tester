import fetchPageData from './fetchPageData';
import { fetchAppData } from '../_app';
import type {
  ExtendedOptions,
  PageData,
  PageObject,
  AppPropsData,
} from '../commonTypes';
import { PushHandler } from '../router/makeRouterMock';

export default async function fetchRouteData({
  pageObject,
  options,
  pushHandler,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
  pushHandler?: PushHandler;
}): Promise<PageData> {
  const appData = await fetchAppData({ pageObject, options, pushHandler });

  // if _app redirects we can skip the page data fetching
  if (appData && 'redirect' in appData) {
    return appData;
  }

  const pageData = await fetchPageData({
    pageObject,
    options,
    appInitialProps: appData as AppPropsData,
  });

  return pageData;
}
