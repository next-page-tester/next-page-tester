import getPageObject from './getPageObject';
import fetchData from './fetchData';
import preparePage from './preparePage';
import type { ReactNode } from 'react';
import { Options } from './commonTypes';

function validateOptions({ route }: { route: string }) {
  if (!route.startsWith('/')) {
    throw new Error('[next page tester] "route" option should start with "/"');
  }
}

export default async function getPage({
  pagesDirectory,
  route,
  req: reqMocker = (req) => req,
  res: resMocker = (res) => res,
  router: routerMocker = (router) => router,
  customApp = false,
}: Options): Promise<ReactNode | undefined> {
  validateOptions({ route });

  const pageObject = await getPageObject({ pagesDirectory, route });
  if (pageObject) {
    const pageData = await fetchData({ pageObject, reqMocker, resMocker });
    const pageElement = preparePage({
      pagesDirectory,
      pageData,
      pageObject,
      routerMocker,
      customApp,
    });
    return pageElement;
  }
}
