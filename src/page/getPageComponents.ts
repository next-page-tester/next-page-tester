import type { PageComponents, PageObject } from '../commonTypes';
import { RuntimeEnvironment } from '../constants';

export function getPageComponents({
  pageObject,
  env,
}: {
  pageObject: PageObject;
  env: RuntimeEnvironment;
}): PageComponents {
  const AppComponent = pageObject.appFile[env].default;
  const PageComponent = pageObject.page[env].default;

  return { AppComponent, PageComponent };
}
