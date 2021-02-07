import type { PageComponents, GenericPageObject } from '../commonTypes';
import { RuntimeEnvironment } from '../constants';

export function getPageComponents({
  pageObject,
  env,
}: {
  pageObject: GenericPageObject;
  env: RuntimeEnvironment;
}): PageComponents {
  const AppComponent = pageObject.appFile[env].default;
  const PageComponent = pageObject.page[env].default;

  return { AppComponent, PageComponent };
}
