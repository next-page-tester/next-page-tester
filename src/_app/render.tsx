import React from 'react';
import type { ExtendedOptions, PageObject, PageProps } from '../commonTypes';

export default function renderApp({
  options,
  pageObject,
  pageProps,
}: {
  options: ExtendedOptions;
  pageObject: PageObject;
  pageProps: PageProps | undefined;
}): JSX.Element {
  const { env } = options;
  const { appFile } = pageObject;
  const AppComponent = appFile[env].default;

  return (
    <AppComponent
      Component={pageObject.page[env].default}
      pageProps={pageProps}
    />
  );
}
