import getPagePaths from './getPagePaths';
import pagePathToRouteRegex from './pagePathToRouteRegex';
import loadPage from './loadPage';

/**
 * @typedef {Object} PageObject
 * @property {Object.<function>} page
 * @property {string} path
 * @property {Object.<string, string>} params
 * @property {number} paramsNumber
 */

/**
 * @param {Object} options
 * @param {string} options.pagesDirectory - Next Pages directory path
 * @param {string} options.route - Next route
 * @returns {(PageObject|undefined)}
 */
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
    .filter(Boolean)
    .sort((a, b) => a.paramsNumber - b.paramsNumber);

  // Return the result with less page params
  return matchingPagePaths[0];
}
