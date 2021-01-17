import getPageObject from './getPageObject';
import { fetchRouteData } from './fetchData';
import type {
  ExtendedOptions,
  PageConstructs,
  PageInfo,
  PageObject,
  RuntimeEnvironment,
} from './commonTypes';

/*
 * Return page info associated with a given path
 */
export async function getPageInfo({
  options,
}: {
  options: ExtendedOptions;
}): Promise<PageInfo> {
  const pageObject = await getPageObject({ options });
  const pageData = await fetchRouteData({ pageObject, options });

  if (pageData.redirect) {
    return getPageInfo({
      options: {
        ...options,
        route: pageData.redirect.destination,
      },
    });
  }

  return { pageObject, pageData };
}

export function makePageConstructs({
  pageObject,
  env,
}: {
  pageObject: PageObject;
  env: RuntimeEnvironment;
}): PageConstructs {
  const AppComponent = pageObject.appFile[env].default;
  const PageComponent = pageObject.page[env].default;

  return {
    AppComponent,
    PageComponent,
    routeData: pageObject,
  };
}
