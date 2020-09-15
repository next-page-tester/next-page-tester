import getPageObject from './getPageObject';
import fetchData from './fetchData';
import preparePage from './preparePage';

function validateOptions({ route }) {
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
}) {
  validateOptions({ route });

  const pageObject = await getPageObject({ pagesDirectory, route });
  if (pageObject) {
    let pageElement = await fetchData({ pageObject, reqMocker, resMocker });
    pageElement = preparePage({ pageElement, pageObject, routerMocker });
    return pageElement;
  }
}
