import getPagePaths from './getPagePaths';
import pagePathToRouteRegex from './pagePathToRouteRegex';
import { loadPage } from './loadPage';
import { parseRoute, parseQueryString } from './utils';
import type {
  OptionsWithDefaults,
  PageObject,
  PageParams,
} from './commonTypes';

export default async function getPageObject({
  options,
}: {
  options: OptionsWithDefaults;
}): Promise<PageObject | undefined> {
  const { pagesDirectory } = options;
  const pageInfo = await getPageInfo({ options });
  if (pageInfo) {
    const page = loadPage({
      pagesDirectory,
      pagePath: pageInfo.pagePath,
    });
    return {
      page,
      ...pageInfo,
    };
  }
}

type RegexCaptureGroups =
  | {
      [name: string]: string;
    }
  | undefined;

function makeParamsObject({
  regexCaptureGroups,
}: {
  regexCaptureGroups: RegexCaptureGroups;
}) {
  const params = {} as PageParams;
  if (regexCaptureGroups) {
    for (const [key, value] of Object.entries(regexCaptureGroups)) {
      if (value !== undefined) {
        params[key] = value.includes('/') ? value.split('/') : value;
      }
    }
  }
  return params;
}

type PageInfo = Pick<
  PageObject,
  'route' | 'pagePath' | 'params' | 'paramsNumber' | 'query'
>;
async function getPageInfo({ options }: { options: OptionsWithDefaults }) {
  const { route } = options;
  const pagePaths = await getPagePaths({ options });
  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);
  const { pathname: routePathName, search } = parseRoute({ route });

  // Match provided route through route regexes generated from /page components
  const matchingPagePaths = pagePaths
    .map((originalPath, index) => {
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
          query: parseQueryString({ queryString: search }),
        };
      }
    })
    .filter((result): result is PageInfo => Boolean(result))
    .sort((a, b) => a.paramsNumber - b.paramsNumber);

  // Return the result with less page params
  return matchingPagePaths[0];
}
