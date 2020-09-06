import getPagePaths from './getPagePaths';
import pagePathToRouteRegex from './pagePathToRouteRegex';
import loadPage from './loadPage';

/**
 * @typedef {Object} PageObject
 * @property {Object.<string, function>} page
 * @property {string} route
 * @property {string} pagePath
 * @property {Object.<string, string>} params
 * @property {number} paramsNumber
 */

/**
 * @param {Object} options
 * @param {string} options.pagesDirectory - Next Pages directory path
 * @param {string} options.route - Next route
 * @returns {(PageObject|undefined)}
 */
export default async function getPageObject({ pagesDirectory, route }) {
  const pageInfo = await getPageInfo({ pagesDirectory, route });
  if (pageInfo) {
    const page = await loadPage({
      pagesDirectory,
      pagePath: pageInfo.pagePath,
    });
    return {
      page,
      ...pageInfo,
    };
  }
}

async function getPageInfo({ pagesDirectory, route }) {
  const pagePaths = await getPagePaths({ pagesDirectory });
  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);

  // Match provided route through route regexes generated from /page components
  const matchingPagePaths = pagePaths
    .map((pagePath, index) => {
      const result = route.match(pagePathRegexes[index]);
      if (result) {
        const params = result.groups || {};
        return {
          route,
          pagePath,
          params,
          paramsNumber: Object.keys(params).length,
        };
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.paramsNumber - b.paramsNumber);

  // Return the result with less page params
  return matchingPagePaths[0];
}
