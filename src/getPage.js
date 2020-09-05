import getPagePaths from './getPagePaths';
import pagePathToRouteRegex from './pagePathToRouteRegex';
import loadPage from './loadPage';

export default async function getPage({ pagesDirectory, route }) {
  const pagePaths = await getPagePaths({ pagesDirectory });
  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);
  // Match provided route through route regexes generated from /page components
  const matchingPagePath = pagePaths.find((path, index) =>
    route.match(pagePathRegexes[index])
  );

  if (matchingPagePath) {
    const page = loadPage({ pagesDirectory, pagePath: matchingPagePath });
    return page;
  }
}
