import getPagePaths from '../getPagePaths';
import { parseRoute } from '../../utils';
import { pagePathToRouteRegex, makeParamsObject } from './utils';
import type { ExtendedOptions, PageParams } from '../../commonTypes';

/**
 * Parse tested route against existing page paths
 */
export default async function parseMatchingRoute({
  options,
}: {
  options: ExtendedOptions;
}): Promise<
  | {
      pagePath: string;
      regexResult: RegExpMatchArray;
      params: PageParams;
    }
  | undefined
> {
  const { route } = options;
  const { pathname: routePath } = parseRoute({ route }).urlObject;
  const pagePaths = await getPagePaths({ options });

  for (const pagePath of pagePaths) {
    const pagePathRegex = pagePathToRouteRegex(pagePath);
    const result = routePath.match(pagePathRegex);

    if (result) {
      return {
        pagePath,
        regexResult: result,
        params: makeParamsObject({
          pagePath,
          routeRegexCaptureGroups: result.groups,
        }),
      };
    }
  }
}
