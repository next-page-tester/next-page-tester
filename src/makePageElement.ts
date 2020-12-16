import getPageObject from './getPageObject';
import { fetchRouteData } from './fetchData';
import { renderApp } from './_app';
import type { PageObject, ExtendedOptions, PageData } from './commonTypes';

/*
 * Return an instance of the page element corresponding
 * to the given path
 */
export default async function makePageElement({
  options,
}: {
  options: ExtendedOptions;
}): Promise<{
  pageElement: JSX.Element;
  pageObject: PageObject;
  pageData: PageData;
}> {
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
  let pageElement = await renderApp({
    options,
    pageObject,
    pageData,
  });

  return { pageElement, pageObject, pageData };
}
