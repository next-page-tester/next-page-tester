import getPagePaths from '../getPagePaths';
import { parseRoute } from '../../utils';
import { pagePathToRouteRegex, makeParamsObject } from './utils';
import type { ExtendedOptions, PageParams } from '../../commonTypes';

/**
 * Parse tested route against existing page paths.
 * @returns path of matching page file and the object of matching params
 */
export default async function parseMatchingRoute({
  options,
}: {
  options: ExtendedOptions;
}): Promise<
  | {
      pagePath: string;
      params: PageParams;
    }
  | undefined
> {
  const { route } = options;
  const { pathname: routePath } = parseRoute({ route }).urlObject;
  const pagePaths = await getPagePaths({ options });

  for (const pagePath of pagePaths) {
    const { regex: pagePathRegex, paramTypes } = pagePathToRouteRegex(pagePath);
    const result = routePath.match(pagePathRegex);

    if (result) {
      return {
        pagePath,
        params: makeParamsObject({
          routeRegexCaptureGroups: result.groups,
          paramTypes,
        }),
      };
    }
  }
}
