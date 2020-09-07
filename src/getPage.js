import getPageObject from './getPageObject';
import preparePage from './preparePage';

export default async function getPage({
  pagesDirectory,
  route,
  req = {},
  res = {},
}) {
  const pageObject = await getPageObject({ pagesDirectory, route });
  if (pageObject) {
    const pageComponent = await preparePage({ pageObject, req, res });
    return pageComponent;
  }
}
