import { NextPage } from 'next';
import React from 'react';
import type {
  ExtendedOptions,
  NextApp,
  GenericPageObject,
  PageProps,
} from '../commonTypes';

export default function renderApp({
  options,
  pageObject,
  pageProps,
}: {
  options: ExtendedOptions;
  pageObject: GenericPageObject;
  pageProps: PageProps | undefined;
}): JSX.Element {
  const { env } = options;
  const {
    appFile: { default: AppComponent },
    pageFile: { default: PageComponent },
  } = pageObject.files[env];

  return renderEnhancedApp({
    App: AppComponent,
    Page: PageComponent,
    pageProps,
    options,
  });
}

export function renderEnhancedApp({
  App,
  Page,
  pageProps,
  options: { wrapper = {} },
}: {
  App: NextApp;
  Page: NextPage;
  pageProps: PageProps | undefined;
  options: ExtendedOptions;
}) {
  let UserEnhancedPage = Page;
  if (wrapper.Page) {
    UserEnhancedPage = wrapper.Page(Page);
  }
  return <App Component={UserEnhancedPage} pageProps={pageProps} />;
}
