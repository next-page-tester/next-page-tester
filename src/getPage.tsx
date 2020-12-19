import React from 'react';
import { existsSync } from 'fs';
import makePageElement from './makePageElement';
import RouterProvider from './RouterProvider';
import { renderDocument } from './_document';
import initHeadManager from 'next/dist/client/head-manager';
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context';
import {
  defaultNextRoot,
  findPagesDirectory,
  getPageExtensions,
} from './utils';
import type {
  Options,
  OptionsWithDefaults,
  ExtendedOptions,
  PageObject,
  PageData,
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

  const headManager = useDocument && initHeadManager();

  const makePage = async (
    optionsOverride?: Partial<ExtendedOptions>
  ): Promise<{
    pageElement: JSX.Element;
    pageObject: PageObject;
    pageData: PageData;
  }> => {
    const mergedOptions = { ...options, ...optionsOverride };
    let { pageElement, pageData, pageObject } = await makePageElement({
      options: mergedOptions,
    });

    if (useDocument && mergedOptions.isClientSideNavigation && headManager) {
      pageElement = (
        // @NOTE: implemented from:
        // https://github.com/vercel/next.js/blob/v10.0.3/packages/next/client/index.tsx#L574
        <HeadManagerContext.Provider value={headManager}>
          {pageElement}
        </HeadManagerContext.Provider>
      );
    }

    return { pageElement, pageData, pageObject };
  };

  let { pageElement, pageData, pageObject } = await makePage();
  let previousRoute = route;

  pageElement = (
    <RouterProvider
      pageObject={pageObject}
      options={options}
      makePage={async (route) => {
        const { pageElement } = await makePage({
          route,
          previousRoute,
          isClientSideNavigation: true,
        });
        previousRoute = route;
        return pageElement;
      }}
    >
      {pageElement}
    </RouterProvider>
  );

  // Optionally wrap with custom Document
  if (useDocument) {
    pageElement = await renderDocument({
      pageElement,
      options,
      pageObject,
      pageData,
    });
  }

  return {
    page: pageElement,
  };
}
