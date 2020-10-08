import { existsSync } from 'fs';
import getPageObject from './getPageObject';
import getCustomAppFile from './getCustomAppFile';
import { fetchAppData, fetchPageData } from './fetchData';
import preparePage from './preparePage';
import { Options, OptionsWithDefaults } from './commonTypes';
import type React from 'react';

function validateOptions({ pagesDirectory, route }: OptionsWithDefaults) {
  if (!route.startsWith('/')) {
    throw new Error('[next page tester] "route" option should start with "/"');
  }

  if (!existsSync(pagesDirectory)) {
    throw new Error(
      '[next page tester] "pagesDirectory" options points to a non-existing folder'
    );
  }
}

export default async function getPage({
  pagesDirectory,
  route,
  req = (req) => req,
  res = (res) => res,
  router = (router) => router,
  customApp = false,
  pageExtensions = ['mdx', 'jsx', 'js', 'ts', 'tsx'],
}: Options): Promise<React.ReactElement> {
  const options: OptionsWithDefaults = {
    pagesDirectory,
    route,
    req,
    res,
    router,
    customApp,
    pageExtensions,
  };
  validateOptions(options);

  const pageObject = await getPageObject({ options });
  if (pageObject === undefined) {
    throw new Error(
      '[next page tester] no matching page found for given route'
    );
  }

  const customAppFile = customApp
    ? await getCustomAppFile({ options })
    : undefined;

  const appInitialProps = customAppFile
    ? await fetchAppData({ customAppFile, pageObject, options })
    : undefined;

  const pageData = await fetchPageData({
    pageObject,
    options,
    appInitialProps,
  });

  const pageElement = await preparePage({
    pageObject,
    pageData,
    options,
  });
  return pageElement;
}
