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
  let AppComponent = DefaultApp;

  if (useApp) {
    if (options.useDocument) {
      if (customAppFile?.server.default) {
        AppComponent = customAppFile.server.default;
      }
    } else {
      if (customAppFile?.client.default) {
        AppComponent = customAppFile.client.default;
      }
    }
  }

  return (
    <AppComponent
      Component={pageObject.page.client.default}
      pageProps={pageData.props}
    />
  );
}
