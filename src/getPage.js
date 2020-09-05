import getPagePaths from './getPagePaths';
import pagePathToRouteRegex from './pagePathToRouteRegex';
import loadPage from './loadPage';

export default async function getPage({ pagesDirectory, route }) {
  const pagePath = await getPagePath({ pagesDirectory, route });
  if (pagePath) {
    const page = await loadPage({
      pagesDirectory,
      pagePath: pagePath.path,
    });
    return {
      page,
      ...pagePath,
    };
  }
}

async function getPagePath({ pagesDirectory, route }) {
  const pagePaths = await getPagePaths({ pagesDirectory });
  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);

  // Match provided route through route regexes generated from /page components
  const matchingPagePaths = pagePaths
    .map((path, index) => {
      const result = route.match(pagePathRegexes[index]);
      if (result) {
        const params = result.groups || {};
        return {
          path,
          params,
          paramsNumber: Object.keys(params).length,
        };
      }
    })
    .filter(Boolean);

  if (matchingPagePaths.length === 0) {
    return undefined;
  }

  if (matchingPagePaths.length === 1) {
    return matchingPagePaths[0];
  }

  // Predefined routes take precedence over dynamic routes
  // https://nextjs.org/docs/routing/dynamic-routes#caveats
  let pagePathWithLessParams = matchingPagePaths[0];
  for (const pagePath of matchingPagePaths) {
    if (pagePath.paramsNumber < pagePathWithLessParams.paramsNumber) {
      pagePathWithLessParams = pagePath;
    }
  }

  return pagePathWithLessParams;
}
