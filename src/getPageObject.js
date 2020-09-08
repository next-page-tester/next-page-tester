import getPagePaths from './getPagePaths';
import pagePathToRouteRegex from './pagePathToRouteRegex';
import loadPage from './loadPage';
import { parseRoute } from './utils';

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

function makeParamsObject({ regexCaptureGroups }) {
  const params = {};
  if (regexCaptureGroups) {
    for (const [key, value] of Object.entries(regexCaptureGroups)) {
      params[key] = value.includes('/') ? value.split['/'] : value;
    }
  }
  return params;
}

async function getPageInfo({ pagesDirectory, route }) {
  const pagePaths = await getPagePaths({ pagesDirectory });
  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);
  const routePathName = parseRoute({ route }).pathname;

  // Match provided route through route regexes generated from /page components
  const matchingPagePaths = pagePaths
    .map((originalPath, index) => {
      console.log('routePathName', routePathName);
      console.log('pagePathRegexe', pagePathRegexes[index]);
      const result = routePathName.match(pagePathRegexes[index]);
      if (result) {
        const params = makeParamsObject({
          regexCaptureGroups: result.groups,
        });
        return {
          route,
          pagePath: originalPath,
          params,
          paramsNumber: Object.keys(params).length,
        };
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.paramsNumber - b.paramsNumber);

  console.log(matchingPagePaths.length);
  console.log(matchingPagePaths[0]);
  // Return the result with less page params
  return matchingPagePaths[0];
}
