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
  isInitialRequest,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
  isInitialRequest: boolean;
}) {
  const { useDocument } = options;
  const appInitialProps = await fetchAppData({
    pageObject,
    options,
    isInitialRequest,
  });
  const pageData = await fetchPageData({
    pageObject,
    options,
    appInitialProps,
    isInitialRequest,
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
