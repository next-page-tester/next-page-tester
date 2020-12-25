import React from 'react';
import getCustomAppFile from './getCustomAppFile';
import DefaultApp from './DefaultApp';
import type { ExtendedOptions, PageData, PageObject } from '../commonTypes';

export default function renderApp({
  options,
  pageObject,
  pageData,
}: {
  options: ExtendedOptions;
  pageObject: PageObject;
  pageData: PageData;
}) {
  const { useApp } = options;
  const customAppFile = getCustomAppFile({ options });
  let AppComponent;

  if (useApp && customAppFile?.default) {
    AppComponent = customAppFile.default;
  } else {
    AppComponent = DefaultApp;
  }

  return (
    <AppComponent
      Component={pageObject.page.default}
      pageProps={pageData.props}
    />
  );
}
