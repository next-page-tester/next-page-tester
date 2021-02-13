import getRouteInfo from './getRouteInfo';
import { getPageFile, getPagePath } from '../page';
import { getAppFile } from '../_app';
import { InternalError } from '../_error/error';
import { makeNotFoundPageObject } from '../404';
import { getMultiEnvNextPageFiles } from '../getNextFiles';
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
    const { pagePath } = routeInfo;
    const appFile = getAppFile({ options });
    const page = getPageFile<NextPageFile>({
      pagePath,
      options,
    });
    const absolutePath = getPagePath({ pagePath, options });

    if (!page.client.default) {
      throw new InternalError('No default export found for given route');
    }
    return {
      page,
      appFile,
      type: 'found',
      ...routeInfo,
      __temp__actualPagePath: pagePath,
      files: getMultiEnvNextPageFiles({ pagePath: absolutePath, options }),
    };
  }

  // Make a NotFoundPageObject for 404 page
  return makeNotFoundPageObject({ options });
}
