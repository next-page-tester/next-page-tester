import React from 'react';
import { getAppFile, getDefaultAppFile } from './getAppFile';
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
  const { useApp, env } = options;
  const appFile = useApp ? getAppFile({ options }) : getDefaultAppFile();
  const AppComponent = appFile[env].default;

  // @TODO render expected client/server instance
  return (
    <AppComponent
      Component={pageObject.page.client.default}
      pageProps={pageData.props}
    />
  );
}
