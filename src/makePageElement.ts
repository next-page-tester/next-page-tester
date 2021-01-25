import getPageObject from './getPageObject';
import { fetchRouteData } from './fetchData';
import type {
  ExtendedOptions,
  PageComponents,
  PageInfo,
  PageObject,
} from './commonTypes';
import { RuntimeEnvironment } from './constants';
import { renderApp } from './_app';
import { render404Page } from './404';

/*
 * Return page info associated with a given path
 */
export async function getPageInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageInfo> {
  const pageObject = await getPageObject({ options });
  if (!pageObject.page) {
    return render404Page({ options, pageObject });
  }

  const pageData = await fetchRouteData({ options, pageObject });
  if (pageData.redirect) {
    return getPageInfo({
      options: {
        ...options,
        route: pageData.redirect.destination,
      },
    });
  }

  if (pageData.notFound) {
    return render404Page({ options, pageObject });
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
