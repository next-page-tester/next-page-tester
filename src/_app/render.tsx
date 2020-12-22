import React from 'react';
import getCustomAppFile from './getCustomAppFile';
import DefaultApp from './DefaultApp';
import type { ExtendedOptions, PageData, PageObject } from '../commonTypes';

export default async function renderApp({
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

  if (useApp && customAppFile?.client?.default) {
    AppComponent = customAppFile.client.default;
  } else {
    AppComponent = DefaultApp;
  }

  return (
    <AppComponent
      Component={pageObject.page.client.default}
      pageProps={pageData.props}
    />
  );
}
