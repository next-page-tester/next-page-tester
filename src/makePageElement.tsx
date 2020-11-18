import React from 'react';
import getCustomAppFile from './getCustomAppFile';
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
  const { useCustomApp } = options;

  const customAppFile = useCustomApp
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
  if (useCustomApp) {
    const customAppFile = await getCustomAppFile({ options });
    if (customAppFile) {
      pageElement = (
        <customAppFile.default Component={page.default} pageProps={props} />
      );
    }
  }

  return pageElement;
}
