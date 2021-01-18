import getPagePaths from './getPagePaths';
import {
  pagePathToRouteRegex,
  extractPagePathParamsType,
  ROUTE_PARAMS_TYPES,
} from './pagePathParser';
import { loadPage } from './loadPage';
import { getAppFile } from './_app';
import { parseRoute, parseQueryString, stringifyQueryString } from './utils';
import type {
  ExtendedOptions,
  PageObject,
  PageParams,
  NextPageFile,
  RouteInfo,
} from './commonTypes';
import { InternalError } from './_error/error';

export default async function getPageObject({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageObject> {
  const routeInfo = await getRouteInfo({ options });
  if (routeInfo) {
    const page = loadPage<NextPageFile>({
      pagePath: routeInfo.pagePath,
      options,
    });

    if (!page.client.default) {
      throw new InternalError('No default export found for given route');
    }
    const appFile = getAppFile({ options });
    return { page, appFile, ...routeInfo };
  }
  throw new InternalError('No matching page found for given route');
}

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

async function getRouteInfo({ options }: { options: ExtendedOptions }) {
  const { route } = options;
  const pagePaths = await getPagePaths({ options });

  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);
  const { pathname: routePathName, search } = parseRoute({ route });
  const query = parseQueryString({ queryString: search });

  // Match provided route through route regexes generated from /page components
  const mathingRouteInfo: RouteInfo[] = pagePaths
    .map((originalPath, index) => {
      const result = routePathName.match(pagePathRegexes[index]);
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
    .filter((result): result is RouteInfo => Boolean(result))
    .sort((a, b) => a.paramsNumber - b.paramsNumber);

  // Return the result with less page params
  return mathingRouteInfo[0];
}
