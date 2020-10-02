import getPageObject from './getPageObject';
import fetchData from './fetchData';
import preparePage from './preparePage';
import type { ReactNode } from 'react';
import { Options, OptionsWithDefaults } from './commonTypes';

function validateOptions({ route }: OptionsWithDefaults) {
  if (!route.startsWith('/')) {
    throw new Error('[next page tester] "route" option should start with "/"');
  }
}

export default async function getPage({
  pagesDirectory,
  route,
  req = (req) => req,
  res = (res) => res,
  router = (router) => router,
  customApp = false,
}: Options): Promise<ReactNode | undefined> {
  const options: OptionsWithDefaults = {
    pagesDirectory,
    route,
    req,
    res,
    router,
    customApp,
  };
  validateOptions(options);

  const pageObject = await getPageObject({ options });
  if (pageObject) {
    const pageData = await fetchData({ pageObject, options });
    const pageElement = preparePage({
      pageObject,
      pageData,
      options,
    });
    return pageElement;
  }
}
