import React from 'react';
import { existsSync } from 'fs';
import getPageObject from './getPageObject';
import makePageElement from './makePageElement';
import NavigationProvider from './NavigationProvider';
import RouterProvider from './RouterProvider';
import {
  defaultNextRoot,
  findPagesDirectory,
  getPageExtensions,
} from './utils';
import type {
  Options,
  OptionsWithDefaults,
  ExtendedOptions,
} from './commonTypes';

function validateOptions({ nextRoot, route }: OptionsWithDefaults) {
  if (!route.startsWith('/')) {
    throw new Error('[next page tester] "route" option should start with "/"');
  }

  if (!existsSync(nextRoot)) {
    throw new Error(
      '[next page tester] Cannot find "nextRoot" directory under: ${nextRoot}'
    );
  }
}

export default async function getPage({
  route,
  nextRoot = defaultNextRoot,
  req = (req) => req,
  res = (res) => res,
  router = (router) => router,
  useCustomApp = false,
}: Options): Promise<React.ReactElement> {
  const optionsWithDefaults: OptionsWithDefaults = {
    route,
    nextRoot,
    req,
    res,
    router,
    useCustomApp,
  };
  validateOptions(optionsWithDefaults);

  const options: ExtendedOptions = {
    ...optionsWithDefaults,
    pagesDirectory: findPagesDirectory({ nextRoot }),
    pageExtensions: getPageExtensions({ nextRoot }),
  };
  // @TODO: Consider printing extended options value behind a debug flag

  const pageObject = await getPageObject({
    options,
  });

  const pageElement = await makePageElement({
    pageObject,
    options,
  });

  type RenderPage = Parameters<typeof NavigationProvider>[0]['renderPage'];
  const renderPage: RenderPage = async (route) => {
    const newOptions = {
      ...options,
      route,
    };
    const pageObject = await getPageObject({
      options: newOptions,
    });
    const pageElement = await makePageElement({
      pageObject,
      options: newOptions,
    });
    return pageElement;
  };

  return (
    <RouterProvider pageObject={pageObject} options={options}>
      <NavigationProvider renderPage={renderPage}>
        {pageElement}
      </NavigationProvider>
    </RouterProvider>
  );
}
