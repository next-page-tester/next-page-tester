import { getPageObject } from '../getPageObject';
import { fetchRouteData } from '../fetchData';
import type { ExtendedOptions, PageInfo } from '../commonTypes';
import { get404PageInfo } from '../404';
import { InternalError } from '../_error';
import { isExternalRoute } from '../utils';
import { PushHandler } from '../router/makeRouterMock';

/*
 * Return page info associated with a given path
 */
export async function getPageInfo({
  options,
  pushHandler,
}: {
  options: ExtendedOptions;
  pushHandler?: PushHandler;
}): Promise<PageInfo> {
  const pageObject = await getPageObject({ options });
  if (pageObject.type === 'notFound') {
    if (isExternalRoute(pageObject.route)) {
      throw new InternalError(`External route: ${pageObject.route}`);
    }
    return get404PageInfo({ options });
  }

  const pageData = await fetchRouteData({ options, pageObject, pushHandler });
  if (pageData.redirect) {
    return getPageInfo({
      pushHandler,
      options: {
        ...options,
        route: pageData.redirect.destination,
      },
    });
  }

  if (pageData.notFound) {
    return get404PageInfo({ options });
  }

  return { pageObject, pageData };
}
