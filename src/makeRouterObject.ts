import { removeFileExtension, parseRoute } from './utils';
import type { PageObject } from './commonTypes';

export default function makeRouterObject({
  pageObject: { pagePath, params, route, query },
}: {
  pageObject: PageObject;
}) {
  const { pathname, search, hash } = parseRoute({ route });
  return {
    asPath: pathname + search + hash, // Includes querystring and anchor
    pathname: removeFileExtension({ path: pagePath }), // Page component path without extension
    query: { ...params, ...query }, // Route params + parsed querystring
    route: removeFileExtension({ path: pagePath }), // Page component path without extension
  };
}
