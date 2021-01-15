import getPageObject from './getPageObject';
import { fetchRouteData } from './fetchData';
import { renderApp } from './_app';
import type { ExtendedOptions, Page } from './commonTypes';

/*
 * Return an instance of the page element corresponding
 * to the given path
 */
export default async function makePageElement({
  options,
}: {
  options: ExtendedOptions;
}): Promise<Page> {
  const pageObject = await getPageObject({
    options,
  });

  const pageData = await fetchRouteData({
    pageObject,
    options,
  });

  if (pageData.redirect) {
    return makePageElement({
      options: {
        ...options,
        route: pageData.redirect.destination,
      },
    });
  }

  // Render page element and optional wrapping custom App
  const pageElement = renderApp({
    options,
    pageObject,
    pageData,
  });

  return { pageElement, pageObject, pageData };
}
