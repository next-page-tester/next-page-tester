import { fetchAppData, renderApp } from './_app';
import { renderDocument } from './_document';
import { fetchPageData } from './fetchData';
import type { PageObject, ExtendedOptions } from './commonTypes';

/*
 * Return an instance of the page element corresponding
 * to the given path
 */
export default async function makePageElement({
  pageObject,
  options,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
}) {
  const { useDocument } = options;
  const appInitialProps = await fetchAppData({ pageObject, options });
  const pageData = await fetchPageData({
    pageObject,
    options,
    appInitialProps,
  });

  // Render page element and optional wrapping custom App
  let pageElement = await renderApp({
    options,
    pageObject,
    pageData,
  });

  // Optionally wrap with custom Document
  if (useDocument) {
    pageElement = await renderDocument({
      pageElement,
      options,
      pageObject,
      pageData,
    });
  }

  return pageElement;
}
