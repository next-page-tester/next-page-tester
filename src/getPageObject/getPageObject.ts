import getRouteInfo from './getRouteInfo';
import { getPagePath } from '../page';
import { InternalError } from '../_error';
import { makeNotFoundPageObject } from '../404';
import { loadExistingPageFiles } from '../getNextFiles';
import type { ExtendedOptions, PageObject } from '../commonTypes';

export async function getPageObject({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageObject> {
  const routeInfo = await getRouteInfo({ options });

  if (routeInfo) {
    const { pagePath } = routeInfo;
    const absolutePagePath = getPagePath({ pagePath, options });
    const files = loadExistingPageFiles({
      absolutePagePath,
      options,
    });

    if (!files.client.pageFile.default) {
      throw new InternalError('No default export found for given route');
    }

    return {
      type: 'found',
      ...routeInfo,
      absolutePagePath,
      files,
    };
  }

  // Make a NotFoundPageObject for 404 page
  return makeNotFoundPageObject({ options });
}
