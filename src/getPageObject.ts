import getPagePaths from './getPagePaths';
import pagePathToRouteRegex from './pagePathToRouteRegex';
import { loadPage } from './loadPage';
import { parseRoute, parseQueryString, stringifyQueryString } from './utils';
import type {
  ExtendedOptions,
  PageObject,
  PageParams,
  NextPageFile,
} from './commonTypes';

export default async function getPageObject({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageObject> {
  const pageInfo = await getPageInfo({ options });
  if (pageInfo) {
    const page = loadPage<NextPageFile>({
      pagePath: pageInfo.pagePath,
      options,
    });

    if (!page.default) {
      throw new Error(
        '[next-page-tester]: No default export found for given route'
      );
    }

    return { page, ...pageInfo };
  }
  throw new Error('[next page tester] No matching page found for given route');
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
  'route' | 'pagePath' | 'params' | 'paramsNumber' | 'query' | 'resolvedUrl'
>;
async function getPageInfo({ options }: { options: ExtendedOptions }) {
  const { route } = options;
  const pagePaths = await getPagePaths({ options });

  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);
  const { pathname: routePathName, search } = parseRoute({ route });
  const query = parseQueryString({ queryString: search });

  // Match provided route through route regexes generated from /page components
  const matchingPageInfo: PageInfo[] = pagePaths
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
          query,
          resolvedUrl:
            routePathName +
            stringifyQueryString({
              object: {
                ...params,
                ...query,
              },
              leadingQuestionMark: true,
            }),
        };
      }
    })
    .filter((result): result is PageInfo => Boolean(result))
    .sort((a, b) => a.paramsNumber - b.paramsNumber);

  // Return the result with less page params
  return matchingPageInfo[0];
}
