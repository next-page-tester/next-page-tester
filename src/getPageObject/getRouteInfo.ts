import { makeRouteInfo } from './makeRouteInfo';
import parseMatchingRoute from './parseMatchingRoute';
import type { ExtendedOptions, RouteInfo } from '../commonTypes';

export default async function getRouteInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<RouteInfo | undefined> {
  const { route } = options;
  const parsedMatchingRoute = await parseMatchingRoute({ options });

  if (parsedMatchingRoute) {
    const { pagePath, params } = parsedMatchingRoute;
    return makeRouteInfo({
      route,
      pagePath,
      params,
    });
  }
}
