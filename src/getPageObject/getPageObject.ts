import getRouteInfo from './getRouteInfo';
import { loadPage } from '../loadPage';
import { getAppFile } from '../_app';
import { parseRoute, parseQueryString, stringifyQueryString } from '../utils';
import type {
  ExtendedOptions,
  PageObject,
  NextPageFile,
  NotFoundPageObject,
} from '../commonTypes';
import { InternalError } from '../_error/error';

export default async function getPageObject({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageObject | NotFoundPageObject> {
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
  // @TODO merge duplicated logic
  const { route } = options;
  const { pathname, search } = parseRoute({ route });
  const query = parseQueryString({ queryString: search });

  return {
    type: 'notFound',
    appFile,
    pagePath: pathname,
    params: {},
    paramsNumber: 0,
    query,
    resolvedUrl:
      pathname +
      stringifyQueryString({ object: query, leadingQuestionMark: true }),
    route,
  };
}
