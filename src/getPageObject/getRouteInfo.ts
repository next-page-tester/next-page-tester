import getPagePaths from './getPagePaths';
import makeRouteInfo from './makeRouteInfo';
import { pagePathToRouteRegex } from './pagePathParser';
import { parseRoute } from '../utils';
import type { ExtendedOptions, RouteInfo } from '../commonTypes';

export default async function getRouteInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<RouteInfo> {
  const { route } = options;
  const pagePaths = await getPagePaths({ options });
  const pagePathRegexes = pagePaths.map(pagePathToRouteRegex);
  const { pathname } = parseRoute({ route });

  // Match provided route through route regexes generated from /page components
  const matchingRouteInfo: RouteInfo[] = pagePaths
    .map((pagePath, index) => {
      const result = pathname.match(pagePathRegexes[index]);
      if (result) {
        return makeRouteInfo({
          route,
          pagePath,
          routeRegexCaptureGroups: result.groups,
        });
      }
    })
    .filter((result): result is RouteInfo => Boolean(result))
    .sort((a, b) => a.paramsNumber - b.paramsNumber);

  // Return the result with less page params
  return matchingRouteInfo[0];
}
