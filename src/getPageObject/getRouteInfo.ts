import getPagePaths from './getPagePaths';
import {
  pagePathToRouteRegex,
  extractPagePathParamsType,
  ROUTE_PARAMS_TYPES,
} from './pagePathParser';
import { parseRoute, parseQueryString, stringifyQueryString } from '../utils';
import type { ExtendedOptions, PageParams, RouteInfo } from '../commonTypes';

function makeParamsObject({
  pagePath,
  regexCaptureGroups,
}: {
  pagePath: string;
  regexCaptureGroups?: Record<string, string>;
}) {
  const params = {} as PageParams;
  const pagePathParams = extractPagePathParamsType({
    pagePath,
  });

  if (regexCaptureGroups) {
    for (const [key, value] of Object.entries(regexCaptureGroups)) {
      if (value !== undefined) {
        const paramType = pagePathParams[key];
        if (
          paramType === ROUTE_PARAMS_TYPES.CATCH_ALL ||
          paramType === ROUTE_PARAMS_TYPES.OPTIONAL_CATCH_ALL
        ) {
          params[key] = value.split('/');
        } else {
          params[key] = value;
        }
      }
    }
  }
  return params;
}

export default async function getRouteInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<RouteInfo> {
  const { route } = options;
  const pagePaths = await getPagePaths({ options });

  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);
  const { pathname, search } = parseRoute({ route });
  const query = parseQueryString({ queryString: search });

  // Match provided route through route regexes generated from /page components
  const matchingRouteInfo: RouteInfo[] = pagePaths
    .map((originalPath, index) => {
      const result = pathname.match(pagePathRegexes[index]);
      if (result) {
        const params = makeParamsObject({
          pagePath: originalPath,
          regexCaptureGroups: result.groups,
        });

        return {
          route,
          pagePath: originalPath,
          params,
          paramsNumber: Object.keys(params).length,
          query,
          resolvedUrl:
            pathname +
            stringifyQueryString({
              object: { ...params, ...query },
              leadingQuestionMark: true,
            }),
        };
      }
    })
    .filter((result): result is RouteInfo => Boolean(result))
    .sort((a, b) => a.paramsNumber - b.paramsNumber);

  // Return the result with less page params
  return matchingRouteInfo[0];
}
