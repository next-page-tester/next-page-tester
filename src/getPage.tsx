/* eslint-disable prefer-const */
import React from 'react';
import { existsSync } from 'fs';
import makePageElement from './makePageElement';
import { makeRenderMethods } from './makeRenderMethods';
import RouterProvider from './RouterProvider';
import { renderDocument } from './_document';
import { renderApp } from './_app';
import initHeadManager from 'next/dist/client/head-manager';
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context';
import { loadNextConfig } from './nextConfig';
import setNextRuntimeConfig from './setNextRuntimeConfig';
import {
  defaultNextRoot,
  findPagesDirectory,
  getPageExtensions,
} from './utils';
import {
  Options,
  OptionsWithDefaults,
  ExtendedOptions,
  Page,
  RuntimeEnvironment,
} from './commonTypes';
import { InternalError } from './_error/error';

function validateOptions({ nextRoot, route }: OptionsWithDefaults) {
  if (!route.startsWith('/')) {
    throw new InternalError('"route" option should start with "/"');
  }

  if (!existsSync(nextRoot)) {
    throw new InternalError(
      'Cannot find "nextRoot" directory under: ${nextRoot}'
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
}: Options): Promise<
  { page: React.ReactElement } & ReturnType<typeof makeRenderMethods>
> {
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
  loadNextConfig({ nextRoot });
  setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.CLIENT });

  const options: ExtendedOptions = {
    ...optionsWithDefaults,
    pagesDirectory: findPagesDirectory({ nextRoot }),
    pageExtensions: getPageExtensions(),
    env: RuntimeEnvironment.SERVER,
  };
  // @TODO: Consider printing extended options value behind a debug flag

  const headManager = useDocument && initHeadManager();

  const makePage = async (
    optionsOverride?: Partial<ExtendedOptions>
  ): Promise<Page> => {
    const mergedOptions = { ...options, ...optionsOverride };
    let { pageElement, pageData, pageObject } = await makePageElement({
      options: mergedOptions,
    });

    if (
      useDocument &&
      mergedOptions.env === RuntimeEnvironment.CLIENT &&
      headManager
    ) {
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

  let {
    pageElement: serverPageElement,
    pageData,
    pageObject,
  } = await makePage();

  serverPageElement = (
    <RouterProvider
      routerEnhancer={options.router}
      routeData={pageObject}
      makePage={makePage}
    >
      {serverPageElement}
    </RouterProvider>
  );

  // Wrap server page with document element
  serverPageElement = await renderDocument({
    pageElement: serverPageElement,
    options,
    pageObject,
    pageData,
  });

  let clientPageElement = renderApp({
    options: { ...options, env: RuntimeEnvironment.CLIENT },
    pageObject,
    pageData,
  });

  clientPageElement = (
    <RouterProvider
      routeData={pageObject}
      routerEnhancer={options.router}
      makePage={makePage}
    >
      {clientPageElement}
    </RouterProvider>
  );

  return {
    page: clientPageElement,
    ...makeRenderMethods({ serverPageElement, clientPageElement }),
  };
}
