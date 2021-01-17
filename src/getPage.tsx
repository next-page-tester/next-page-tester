/* eslint-disable prefer-const */
import React from 'react';
import { existsSync } from 'fs';
import { getPageInfo, makePageConstructs } from './makePageElement';
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
  RuntimeEnvironment,
  MakePageResult,
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
  nonIsolatedModules = [],
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
    nonIsolatedModules,
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
    options: ExtendedOptions
  ): Promise<MakePageResult> => {
    const { pageData, pageObject } = await getPageInfo({ options });
    const { AppComponent, PageComponent, routeData } = makePageConstructs({
      pageObject,
      env: options.env,
    });

    const pageElement = (
      <AppComponent Component={PageComponent} pageProps={pageData.props} />
    );

    if (
      !useDocument ||
      options.env !== RuntimeEnvironment.CLIENT ||
      !headManager
    ) {
      return { pageElement, routeData };
    }

    return {
      routeData,
      pageElement: (
        // @NOTE: implemented from:
        // https://github.com/vercel/next.js/blob/v10.0.3/packages/next/client/index.tsx#L574
        <HeadManagerContext.Provider value={headManager}>
          {pageElement}
        </HeadManagerContext.Provider>
      ),
    };
  };

  let { pageData, pageObject } = await getPageInfo({ options });

  const wrapWithRouter = (children: JSX.Element) => {
    return (
      <RouterProvider
        options={options}
        routeData={pageObject}
        makePage={(optionsOverrides) =>
          makePage({ ...options, ...optionsOverrides })
        }
      >
        {children}
      </RouterProvider>
    );
  };

  const serverPageElement = await renderDocument({
    options,
    pageObject,
    wrapWithRouter,
    pageProps: pageData.props,
  });

  const clientPageElement = wrapWithRouter(
    renderApp({
      options: { ...options, env: RuntimeEnvironment.CLIENT },
      pageObject,
      pageProps: pageData.props,
    })
  );

  return {
    page: clientPageElement,
    ...makeRenderMethods({ serverPageElement, clientPageElement }),
  };
}
