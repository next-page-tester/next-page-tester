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
  NotFoundPageObject,
} from './commonTypes';
import { InternalError } from './_error/error';

export default async function getPageObject({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageObject | NotFoundPageObject> {
  const routeInfo = await getRouteInfo({ options });
  const appFile = getAppFile({ options });

  if (routeInfo) {
    const page = loadPage<NextPageFile>({
      pagePath: routeInfo.pagePath,
      options,
    });

    if (!page.client.default) {
      throw new InternalError('No default export found for given route');
    }
    return { page, appFile, type: 'found', ...routeInfo };
  }

  // 404
  const { route } = options;
  const { pathname, search } = parseRoute({ route });
  const query = parseQueryString({ queryString: search });

  return {
    type: 'notFound',
    appFile,
    pagePath: pathname,
    params: {},
    paramsNumber: Object.keys(query).length,
    query,
    resolvedUrl:
      pathname +
      stringifyQueryString({ object: query, leadingQuestionMark: true }),
    route,
  };
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

async function getRouteInfo({
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
  const mathingRouteInfo: RouteInfo[] = pagePaths
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
  return mathingRouteInfo[0];
}
