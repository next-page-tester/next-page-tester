import { NextPage } from 'next';
import React from 'react';
import type {
  ExtendedOptions,
  NextApp,
  PageObject,
  PageProps,
} from '../commonTypes';

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
  let UserEnhancedApp = App;

  if (wrapper.App) {
    UserEnhancedApp = wrapper.App(App);
  }

  if (wrapper.Page) {
    UserEnhancedPage = wrapper.Page(Page);
  }

  return <UserEnhancedApp Component={UserEnhancedPage} pageProps={pageProps} />;
}
