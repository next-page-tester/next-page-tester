import { NextPage } from 'next';
import React from 'react';
import type {
  ExtendedOptions,
  NextApp,
  PageObject,
  PageProps,
  AppWrapper,
  PageWrapper,
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
  const files = pageObject.files[env];

  const {
    appFile: { default: AppComponent },
    pageFile: { default: PageComponent },
    wrappersFile,
  } = files;

  const wrappers = {
    appWrapper: wrappersFile?.App,
    pageWrapper: wrappersFile?.Page,
  };

  return renderEnhancedApp({
    App: AppComponent,
    Page: PageComponent,
    appProps,
    pageProps,
    wrappers,
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
  wrappers,
}: {
  App: NextApp;
  Page: NextPage;
  appProps: PageProps | undefined;
  pageProps: PageProps | undefined;
  wrappers: {
    appWrapper?: AppWrapper;
    pageWrapper?: PageWrapper;
  };
}): JSX.Element {
  let UserEnhancedPage = Page;
  let UserEnhancedApp = App;

  if (wrappers.appWrapper) {
    UserEnhancedApp = wrappers.appWrapper(App);
  }

  if (wrappers.pageWrapper) {
    UserEnhancedPage = wrappers.pageWrapper(Page);
  }

  return (
    <UserEnhancedApp
      Component={UserEnhancedPage}
      pageProps={pageProps}
      {...appProps}
    />
  );
}
