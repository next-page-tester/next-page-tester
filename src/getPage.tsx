import React from 'react';
import { existsSync } from 'fs';
import makePageElement from './makePageElement';
import NavigationProvider from './NavigationProvider';
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

  // For NextJS to correctly query <head> element we have to proxy its query through body (as this is where RTL will render the whole output to)
  // to avoid "Warning: next-head-count is missing. https://err.sh/next.js/next-head-count-missing"
  // https://github.com/vercel/next.js/blob/c96c13a71b61b93c87ed34f11ae7d37ede44eaec/packages/next/client/head-manager.ts#L36
  const { getElementsByTagName } = document;
  document.getElementsByTagName = function <K extends string>(this, tag: K) {
    if (tag === 'head') {
      return document.body.getElementsByTagName(tag);
    }

    document.getElementsByTagName = getElementsByTagName;
    return this.getElementsByTagName(tag);
  };

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
    <RouterProvider pageObject={pageObject} options={options}>
      <NavigationProvider
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
      </NavigationProvider>
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
