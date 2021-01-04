import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { existsSync } from 'fs';
import makePageElement from './makePageElement';
import makeRenderMethods from './makeRenderMethods';
import RouterProvider from './RouterProvider';
import { renderDocument } from './_document';
import { renderApp } from './_app';
import initHeadManager from 'next/dist/client/head-manager';
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context';
import { executeAsIfOnServerSync } from './server';
import {
  defaultNextRoot,
  findPagesDirectory,
  getPageExtensions,
} from './utils';
import type {
  Options,
  OptionsWithDefaults,
  ExtendedOptions,
  Page,
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
}: Options): Promise<
  {
    page: React.ReactElement;
    html: string;
  } & ReturnType<typeof makeRenderMethods>
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

  const options: ExtendedOptions = {
    ...optionsWithDefaults,
    pagesDirectory: findPagesDirectory({ nextRoot }),
    pageExtensions: getPageExtensions({ nextRoot }),
    env: 'server',
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

    if (useDocument && mergedOptions.env === 'client' && headManager) {
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

  let clientPageElement = renderApp({
    options: {
      ...options,
      env: 'client',
    },
    pageObject,
    pageData,
  });

  serverPageElement = (
    <RouterProvider
      pageObject={pageObject}
      options={options}
      makePage={makePage}
    >
      {serverPageElement}
    </RouterProvider>
  );

  clientPageElement = (
    <RouterProvider
      pageObject={pageObject}
      options={options}
      makePage={makePage}
    >
      {clientPageElement}
    </RouterProvider>
  );

  // Wrap page with document element
  const documentElement = await renderDocument({
    pageElement: serverPageElement,
    options,
    pageObject,
    pageData,
  });

  const html: string = executeAsIfOnServerSync(() =>
    ReactDOMServer.renderToString(documentElement)
  );

  return {
    page: clientPageElement,
    html,
    ...makeRenderMethods({ pageElement: clientPageElement, html }),
  };
}
