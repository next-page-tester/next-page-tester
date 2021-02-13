import { get404PageFile, get404PagePath } from './get404PageFile';
import { parseRoute } from '../utils';
import { makeRouteInfo } from '../getPageObject';
import { getAppFile } from '../_app';
import { getMultiEnvNextErrorPageFiles } from '../getNextFiles';
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
  const appFile = getAppFile({ options });
  const pagePath = get404PagePath({ options });

  return {
    ...notFoundPageRouteInfo,
    type: 'notFound',
    appFile,
    page: get404PageFile({ options }),
    __temp__actualPagePath: pagePath,
    files: getMultiEnvNextErrorPageFiles({ pagePath, options }),
  };
}
