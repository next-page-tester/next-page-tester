import getPagePaths from './getPagePaths';
import { makeRouteInfo } from './makeRouteInfo';
import { pagePathToRouteRegex } from './pagePathParser';
import { parseRoute } from '../utils';
import type { ExtendedOptions, RouteInfo } from '../commonTypes';

export default async function getRouteInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<RouteInfo | undefined> {
  const { route } = options;
  const { pathname } = parseRoute({ route });
  const pagePaths = await getPagePaths({ options });

  for (const pagePath of pagePaths) {
    const pagePathRegex = pagePathToRouteRegex(pagePath);
    const result = pathname.match(pagePathRegex);
    if (result) {
      return makeRouteInfo({
        route,
        pagePath,
        routeRegexCaptureGroups: result.groups,
      });
    }
  }
}
