import { parseRoute, parseQueryString, stringifyQueryString } from '../utils';
import type { PageParams, RouteInfo } from '../commonTypes';

export function makeRouteInfo({
  route,
  pagePath,
  params = {} as PageParams,
}: {
  route: string;
  pagePath: string;
  params?: PageParams;
}): RouteInfo {
  const { urlObject, detectedLocale } = parseRoute({ route });
  const { pathname, search } = urlObject;

  const query = parseQueryString({ queryString: search });

  return {
    route,
    params,
    query,
    pagePath,
    resolvedUrl:
      pathname +
      stringifyQueryString({
        object: { ...params, ...query },
        leadingQuestionMark: true,
      }),
    detectedLocale,
    urlObject,
  };
}
