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
    appWrapperFile,
    pageWrapperFile,
  } = files;

  const appWrapper = appWrapperFile?.default;
  const pageWrapper = pageWrapperFile?.default;

  return renderEnhancedApp({
    App: AppComponent,
    appWrapper,
    Page: PageComponent,
    pageWrapper,
    appProps,
    pageProps,
  });
}

/*
 * Render App and Page component inside optional wrapper provided as options.wrapper
 */
export function renderEnhancedApp({
  App,
  Page,
  appWrapper,
  pageWrapper,
  appProps,
  pageProps,
}: {
  App: NextApp;
  Page: NextPage;
  appWrapper?: AppWrapper;
  pageWrapper?: PageWrapper;
  appProps: PageProps | undefined;
  pageProps: PageProps | undefined;
}): JSX.Element {
  let UserEnhancedPage = Page;
  let UserEnhancedApp = App;

  if (appWrapper) {
    UserEnhancedApp = appWrapper(App);
  }

  if (pageWrapper) {
    UserEnhancedPage = pageWrapper(Page);
  }

  return (
    <UserEnhancedApp
      Component={UserEnhancedPage}
      pageProps={pageProps}
      {...appProps}
    />
  );
}
