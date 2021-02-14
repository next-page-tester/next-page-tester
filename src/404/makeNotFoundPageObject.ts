import { get404PagePath } from './index';
import { parseRoute } from '../utils';
import { makeRouteInfo } from '../getPageObject';
import { loadErrorPageFiles } from '../getNextFiles';
import type { ExtendedOptions, NotFoundPageObject } from '../commonTypes';

// @NOTE we currently set pagePath as current path name, but it should
// be the path of the currently rendered page file
export function makeNotFoundPageObject({
  options,
}: {
  options: ExtendedOptions;
}): NotFoundPageObject {
  const { route } = options;
  const { pathname } = parseRoute({ route });
  const notFoundPageRouteInfo = makeRouteInfo({
    route,
    pagePath: pathname,
  });
  const absolutePagePath = get404PagePath({ options });

  return {
    ...notFoundPageRouteInfo,
    type: 'notFound',
    absolutePagePath,
    files: loadErrorPageFiles({ absolutePagePath, options }),
  };
}
