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
  appProps,
}: {
  options: ExtendedOptions;
  pageObject: PageObject;
  pageProps: PageProps | undefined;
  appProps: PageProps | undefined;
}): JSX.Element {
  const { env } = options;
  const {
    appFile: { default: AppComponent },
    pageFile: { default: PageComponent },
  } = pageObject.files[env];

  return renderEnhancedApp({
    App: AppComponent,
    Page: PageComponent,
    appProps,
    pageProps,
    options,
  });
}

/*
 * Render App and Page component inside optional wrapper provided as options.wrapper
 */
export function renderEnhancedApp({
  App,
  Page,
  appProps,
  pageProps,
  options: { wrapper = {} },
}: {
  App: NextApp;
  Page: NextPage;
  appProps: PageProps | undefined;
  pageProps: PageProps | undefined;
  options: ExtendedOptions;
}): JSX.Element {
  let UserEnhancedPage = Page;
  let UserEnhancedApp = App;

  if (wrapper.App) {
    UserEnhancedApp = wrapper.App(App);
  }

  if (wrapper.Page) {
    UserEnhancedPage = wrapper.Page(Page);
  }

  return (
    <UserEnhancedApp
      Component={UserEnhancedPage}
      pageProps={pageProps}
      {...appProps}
    />
  );
}
