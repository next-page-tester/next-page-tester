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
    const files = await loadExistingPageFiles({
      absolutePagePath,
      options,
    });

    // Since ESM this check needs to be different.
    // Before we could just check for the existence of default.
    // Now we need to check if default is a "function" type to know if something has been exported
    // Because default will always be present regardless of what's in the file
    if (typeof files.client.pageFile.default !== 'function') {
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
