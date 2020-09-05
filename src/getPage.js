import getPagePaths from './getPagePaths';
import pagePathToRouteRegex from './pagePathToRouteRegex';
import loadPage from './loadPage';

export default async function getPage({ pagesDirectory, route }) {
  const pagePaths = await getPagePaths({ pagesDirectory });
  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);

  // Match provided route through route regexes generated from /page components
  const matchingPagePaths = pagePaths.filter((path, index) => {
    return route.match(pagePathRegexes[index]);
  });

  if (!matchingPagePaths.length) {
    return undefined;
  }

  if (matchingPagePaths.length === 1) {
    const page = loadPage({ pagesDirectory, pagePath: matchingPagePaths[0] });
    return page;
  }

  // Predefined routes take precedence over dynamic routes
  // https://nextjs.org/docs/routing/dynamic-routes#caveats
}
