import {
  extractPagePathParamsType,
  ROUTE_PARAMS_TYPES,
} from './pagePathParser';
import { parseRoute, parseQueryString, stringifyQueryString } from '../utils';
import type { PageParams, RouteInfo } from '../commonTypes';

export default function makeRouteInfo({
  route,
  pagePath,
  routeRegexCaptureGroups,
}: {
  route: string;
  pagePath: string;
  routeRegexCaptureGroups?: Record<string, string>;
}): RouteInfo {
  const { pathname, search } = parseRoute({ route });
  const params = makeParamsObject({
    pagePath,
    routeRegexCaptureGroups,
  });
  const query = parseQueryString({ queryString: search });

  return {
    route,
    params,
    query,
    pagePath,
    paramsNumber: Object.keys(params).length,
    resolvedUrl:
      pathname +
      stringifyQueryString({
        object: { ...params, ...query },
        leadingQuestionMark: true,
      }),
  };
}

function makeParamsObject({
  pagePath,
  routeRegexCaptureGroups,
}: {
  pagePath: string;
  routeRegexCaptureGroups?: Record<string, string>;
}) {
  const params = {} as PageParams;
  const pagePathParams = extractPagePathParamsType({
    pagePath,
  });

  if (routeRegexCaptureGroups) {
    for (const [key, value] of Object.entries(routeRegexCaptureGroups)) {
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
