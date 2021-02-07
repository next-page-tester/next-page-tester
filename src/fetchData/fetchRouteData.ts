import fetchPageData from './fetchPageData';
import { fetchAppData } from '../_app';
import type { ExtendedOptions, GenericPageObject } from '../commonTypes';

export default async function fetchRouteData({
  pageObject,
  options,
}: {
  pageObject: GenericPageObject;
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
