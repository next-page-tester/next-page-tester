import { getPageObject } from '../getPageObject';
import { fetchRouteData } from '../fetchData';
import type { ExtendedOptions, PageInfo } from '../commonTypes';
import { get404PageInfo } from '../404';
import { InternalError } from '../_error';
import { isExternalRoute } from '../utils';

/*
 * Return page info associated with a given path
 */
export async function getPageInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageInfo> {
  const pageObject = await getPageObject({ options });
  if (pageObject.type === 'notFound') {
    if (isExternalRoute(pageObject.route)) {
      throw new InternalError(`External route: ${pageObject.route}`);
    }
    return get404PageInfo({ options });
  }

  const pageData = await fetchRouteData({ options, pageObject });
  if (pageData.redirect) {
    return getPageInfo({
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
