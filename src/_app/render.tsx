import React from 'react';
import type { ExtendedOptions, PageObject, PageProps } from '../commonTypes';
import { getPageComponents } from '../makePageElement';

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
  const { AppComponent, PageComponent } = getPageComponents({
    pageObject,
    env,
  });

  return <AppComponent Component={PageComponent} pageProps={pageProps} />;
}
