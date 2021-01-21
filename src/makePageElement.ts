import getPageObject from './getPageObject';
import { fetchRouteData, fetchPageData } from './fetchData';
import type {
  ExtendedOptions,
  PageComponents,
  PageInfo,
  PageObject,
} from './commonTypes';
import { RuntimeEnvironment } from './constants';
import { renderApp } from './_app';
import { get404File, notFoundResponseEnhancer } from './404';

/*
 * Return page info associated with a given path
 */
export async function getPageInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageInfo> {
  const pageObject = await getPageObject({ options });
  let pageData = await fetchRouteData({ pageObject, options });

  if (pageData.redirect) {
    return getPageInfo({
      options: {
        ...options,
        route: pageData.redirect.destination,
      },
    });
  }

  if (pageData.notFound) {
    pageObject.page = await get404File({ options });
    options.res = notFoundResponseEnhancer({ options });
    pageData = await fetchPageData({ pageObject, options });
  }

  return { pageObject, pageData };
}

export function getPageComponents({
  pageObject,
  env,
}: {
  pageObject: PageObject;
  env: RuntimeEnvironment;
}): PageComponents {
  const AppComponent = pageObject.appFile[env].default;
  const PageComponent = pageObject.page[env].default;

  return { AppComponent, PageComponent };
}

export default async function makePageElement({
  options,
}: {
  options: ExtendedOptions;
}) {
  const { pageData, pageObject } = await getPageInfo({ options });
  const pageElement = renderApp({
    options,
    pageObject,
    pageProps: pageData.props,
  });

  return { pageElement, pageObject };
}
