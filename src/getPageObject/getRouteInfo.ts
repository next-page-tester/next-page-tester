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
    const result = pathname.match(pagePathToRouteRegex(pagePath));

    if (!result) continue;

    return makeRouteInfo({
      route,
      pagePath,
      routeRegexCaptureGroups: result.groups,
    });
  }

  return;
}
