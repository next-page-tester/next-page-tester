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
  ReqEnhancer,
  Req,
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
  useApp = true,
  useDocument = false,
}: Options): Promise<{ page: React.ReactElement }> {
  const optionsWithDefaults: OptionsWithDefaults = {
    route,
    nextRoot,
    req,
    res,
    router,
    useApp,
    useDocument,
  };
  validateOptions(optionsWithDefaults);

  const options: ExtendedOptions = {
    ...optionsWithDefaults,
    pagesDirectory: findPagesDirectory({ nextRoot }),
    pageExtensions: getPageExtensions({ nextRoot }),
  };
  // @TODO: Consider printing extended options value behind a debug flag

  const makePage = async (route?: string, reqEnchancer?: ReqEnhancer) => {
    const newOptions = {
      ...options,
      route: route || options.route,
      req: reqEnchancer || options.req,
    };

    const pageObject = await getPageObject({
      options: newOptions,
    });

    const pageElement = await makePageElement({
      pageObject,
      options: newOptions,
    });

    return { pageElement, pageObject };
  };

  const { pageElement, pageObject } = await makePage();

  return {
    page: (
      <RouterProvider pageObject={pageObject} options={options}>
        <NavigationProvider
          makePage={async (route) => {
            const { pageElement } = await makePage(route, (request) => {
              const enhancedRequest = req(request);
              enhancedRequest.headers.cookie = document.cookie;
              enhancedRequest.headers.referer = window.location.href;
              return enhancedRequest;
            });
            return pageElement;
          }}
        >
          {pageElement}
        </NavigationProvider>
      </RouterProvider>
    ),
  };
}
