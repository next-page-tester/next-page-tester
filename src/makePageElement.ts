import { renderApp } from './_app';
import { renderDocument } from './_document';
import type { PageObject, ExtendedOptions, PageData } from './commonTypes';

/*
 * Return an instance of the page element corresponding
 * to the given path
 */
export default async function makePageElement({
  pageObject,
  options,
  pageData,
}: {
  pageObject: PageObject;
  options: ExtendedOptions;
  pageData: PageData;
}) {
  const { useDocument } = options;
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
