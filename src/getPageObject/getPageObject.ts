import getRouteInfo from './getRouteInfo';
import makeRouteInfo from './makeRouteInfo';
import { loadPage } from '../loadPage';
import { getAppFile } from '../_app';
import { parseRoute } from '../utils';
import type {
  ExtendedOptions,
  NextPageFile,
  GenericPageObject,
} from '../commonTypes';
import { InternalError } from '../_error/error';
import { get404PageFile } from '../404';

export default async function getPageObject({
  options,
}: {
  options: ExtendedOptions;
}): Promise<GenericPageObject> {
  const routeInfo = await getRouteInfo({ options });
  const appFile = getAppFile({ options });

  if (routeInfo) {
    const page = loadPage<NextPageFile>({
      pagePath: routeInfo.pagePath,
      options,
    });

    if (!page.client.default) {
      throw new InternalError('No default export found for given route');
    }
    return { page, appFile, type: 'found', ...routeInfo };
  }

  // Make a NotFoundPageObject for 404 page
  // @NOTE we currently set pagePath as current path name, but it should
  // be the path of the currently rendered page file
  const { route } = options;
  const { pathname } = parseRoute({ route });
  const notFoundPageRouteInfo = makeRouteInfo({
    route,
    pagePath: pathname,
  });

  return {
    ...notFoundPageRouteInfo,
    type: 'notFound',
    appFile,
    page: get404PageFile({ options }),
  };
}
