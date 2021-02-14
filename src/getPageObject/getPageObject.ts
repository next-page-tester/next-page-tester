import getRouteInfo from './getRouteInfo';
import { getPagePath } from '../page';
import { InternalError } from '../_error/error';
import { makeNotFoundPageObject } from '../404';
import { getMultiEnvNextPageFiles } from '../getNextFiles';
import type { ExtendedOptions, GenericPageObject } from '../commonTypes';

export async function getPageObject({
  options,
}: {
  options: ExtendedOptions;
}): Promise<GenericPageObject> {
  const routeInfo = await getRouteInfo({ options });

  if (routeInfo) {
    const { pagePath } = routeInfo;
    const absolutePagePath = getPagePath({ pagePath, options });
    const files = getMultiEnvNextPageFiles({
      pagePath: absolutePagePath,
      options,
    });

    if (!files.client.pageFile.default) {
      throw new InternalError('No default export found for given route');
    }

    return {
      type: 'found',
      ...routeInfo,
      __temp__actualPagePath: pagePath,
      files,
    };
  }

  // Make a NotFoundPageObject for 404 page
  return makeNotFoundPageObject({ options });
}
