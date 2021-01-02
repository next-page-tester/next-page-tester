import React from 'react';
import type { ExtendedOptions, PageData, PageObject } from '../commonTypes';
import { executeAsIfOnServerSync } from '../server';

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

  return env === 'server' ? (
    executeAsIfOnServerSync(() => (
      <AppComponent
        Component={pageObject.page[env].default}
        pageProps={pageData.props}
      />
    ))
  ) : (
    <AppComponent
      Component={pageObject.page[env].default}
      pageProps={pageData.props}
    />
  );
}
