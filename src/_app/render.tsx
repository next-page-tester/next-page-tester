import React from 'react';
import type { ExtendedOptions, PageData, PageObject } from '../commonTypes';

export default function renderApp({
  options,
  pageObject,
  pageData,
}: {
  options: ExtendedOptions;
  pageObject: PageObject;
  pageData: PageData;
}): JSX.Element {
  const { env } = options;
  const { appFile } = pageObject;
  const AppComponent = appFile[env].default;

  return (
    <AppComponent
      Component={pageObject.page[env].default}
      pageProps={pageData.props}
    />
  );
}
