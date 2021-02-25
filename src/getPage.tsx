/* eslint-disable prefer-const */
import React from 'react';
import { existsSync } from 'fs';
import { makePageElement, getPageInfo } from './page';
import { makeRenderMethods } from './makeRenderMethods';
import { RouterProvider } from './router';
import { serverRenderDocument } from './_document';
import { renderApp } from './_app';
import initHeadManager from 'next/dist/client/head-manager';
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context';
import { loadNextConfig } from './nextConfig';
import setNextRuntimeConfig from './setNextRuntimeConfig';
import { loadBaseEnvironment, setEnvVars } from './setEnvVars';
import {
  defaultNextRoot,
  findPagesDirectory,
  getPageExtensions,
} from './utils';
import {
  Options,
  OptionsWithDefaults,
  ExtendedOptions,
  MakePageResult,
} from './commonTypes';
import { InternalError } from './_error';
import { RuntimeEnvironment } from './constants';

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
  dotenvFile,
  wrapper,
  sharedModules = [],
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
    dotenvFile,
    wrapper,
    sharedModules,
  };

  validateOptions(optionsWithDefaults);

  loadBaseEnvironment({ nextRoot, dotenvFile });
  loadNextConfig({ nextRoot });
  setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.CLIENT });
  setEnvVars({ runtimeEnv: RuntimeEnvironment.CLIENT });

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
    let { pageElement, pageObject } = await makePageElement({ options });
    if (
      useDocument &&
      options.env === RuntimeEnvironment.CLIENT &&
      headManager
    ) {
      pageElement = (
        <HeadManagerContext.Provider value={headManager}>
          {pageElement}
        </HeadManagerContext.Provider>
      );
    }
    return { pageObject, pageElement };
  };

  const { pageData, pageObject } = await getPageInfo({ options });

  const wrapWithRouter = (children: JSX.Element) => {
    return (
      <RouterProvider
        options={options}
        pageObject={pageObject}
        makePage={(optionsOverrides) =>
          makePage({ ...options, ...optionsOverrides })
        }
      >
        {children}
      </RouterProvider>
    );
  };

  const serverPageElement = await serverRenderDocument({
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
