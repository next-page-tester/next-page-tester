import getPageObject from './getPageObject';
import preparePage from './preparePage';

export default async function getPage({ pagesDirectory, route }) {
  const pageObject = await getPageObject({ pagesDirectory, route });
  if (pageObject) {
    const pageComponent = await preparePage({ pageObject });
    return pageComponent;
  }
}
