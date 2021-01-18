import fetchPageData from './fetchPageData';
import { fetchAppData } from '../_app';
import type { ExtendedOptions, PageObject } from '../commonTypes';

export default async function fetchRouteData({
  pageObject,
  options,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
}) {
  const appInitialProps = await fetchAppData({
    pageObject,
    options,
  });
  const pageData = await fetchPageData({
    pageObject,
    options,
    appInitialProps,
  });
  return pageData;
}
