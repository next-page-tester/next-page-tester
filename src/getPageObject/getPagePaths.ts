import path from 'path';
import 'setimmediate'; // fast-glob needs setImmediate global
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { getSortedRoutes } from 'next/dist/next-server/lib/router/utils/sorted-routes';
import type { ExtendedOptions } from '../commonTypes';

// Returns available page paths without file extension
async function getPagePaths({
  options: { pagesDirectory, pageExtensions },
}: {
  options: ExtendedOptions;
}): Promise<string[]> {
  const files = await fastGlob([
    normalizePath(path.join(pagesDirectory, '**', '*')),
  ]);
  const extensionsRegex = new RegExp(`.(${pageExtensions.join('|')})$`);

  return getSortedRoutes(
    files
      // Make page paths relative
      .map((filePath) => filePath.replace(normalizePath(pagesDirectory), ''))
      // Filter out files with non-allowed extensions
      .filter((filePath) => filePath.match(extensionsRegex))
      // Strip file extensions
      .map((filePath) => filePath.replace(extensionsRegex, ''))
      // Filter out /api folder
      .filter((filePath) => !filePath.startsWith('/api/'))
      // Filter out /_app and /_document files
      .filter((filePath) => filePath !== '/_app' && filePath !== '/_document')
  );
}

export default getPagePaths;
