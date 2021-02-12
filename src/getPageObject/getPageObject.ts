import getRouteInfo from './getRouteInfo';
import { getPageFile } from '../page';
import { getAppFile } from '../_app';
import { InternalError } from '../_error/error';
import { makeNotFoundPageObject } from '../404';
import type {
  ExtendedOptions,
  NextPageFile,
  GenericPageObject,
} from '../commonTypes';

export async function getPageObject({
  options,
}: {
  options: ExtendedOptions;
}): Promise<GenericPageObject> {
  const routeInfo = await getRouteInfo({ options });

  if (routeInfo) {
    const appFile = getAppFile({ options });
    const page = getPageFile<NextPageFile>({
      pagePath: routeInfo.pagePath,
      options,
    });

    if (!page.client.default) {
      throw new InternalError('No default export found for given route');
    }
    return {
      page,
      appFile,
      type: 'found',
      ...routeInfo,
      __temp__actualPagePath: routeInfo.pagePath,
    };
  }

  // Make a NotFoundPageObject for 404 page
  return makeNotFoundPageObject({ options });
}
