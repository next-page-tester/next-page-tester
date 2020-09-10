import getPageObject from './getPageObject';
import fetchData from './fetchData';
import preparePage from './preparePage';

export default async function getPage({
  pagesDirectory,
  route,
  req = {},
  res = {},
}) {
  const pageObject = await getPageObject({ pagesDirectory, route });
  if (pageObject) {
    let pageElement = await fetchData({ pageObject, req, res });
    pageElement = preparePage({ pageElement, pageObject });
    return pageElement;
  }
}
