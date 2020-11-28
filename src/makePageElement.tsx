import React from 'react';
import getCustomAppFile from './getCustomAppFile';
import { renderDocument } from './_document';
import { fetchAppData, fetchPageData } from './fetchData';
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
  const { useApp, useDocument } = options;
  const customAppFile = useApp
    ? await getCustomAppFile({ options })
    : undefined;

  const appInitialProps = customAppFile
    ? await fetchAppData({ customAppFile, pageObject, options })
    : undefined;

  const pageData = await fetchPageData({
    pageObject,
    options,
    appInitialProps,
  });

  // Render page element
  const { page } = pageObject;
  const { props } = pageData;
  let pageElement = <page.default {...props} />;

  // Optionally wrap with custom App
  if (useApp && customAppFile) {
    pageElement = (
      <customAppFile.default Component={page.default} pageProps={props} />
    );
  }

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
