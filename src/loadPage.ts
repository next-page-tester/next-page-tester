import path from 'path';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { NextPageFile, ExtendedOptions } from './commonTypes';
import { getServerPage } from './server';

export function loadPage({
  pagesDirectory,
  pagePath,
}: {
  pagesDirectory: string;
  pagePath: string;
}): {
  client: NextPageFile;
  server: NextPageFile;
} {
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));
  return {
    client: require(absolutePath),
    server: getServerPage({ path: absolutePath }),
  };
}

export function loadPageWithUnknownExtension<FileType>({
  pagePath,
  options: { pagesDirectory, pageExtensions },
}: {
  pagePath: string;
  options: ExtendedOptions;
}): FileType | undefined {
  const pageExtensionGlobPattern = `.{${pageExtensions.join(',')}}`;
  const files = fastGlob.sync([
    normalizePath(pagesDirectory + pagePath + pageExtensionGlobPattern),
  ]);

  if (!files.length) {
    return;
  }

  return require(files[0]);
}
