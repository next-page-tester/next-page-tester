import path from 'path';
import fastGlob from 'fast-glob';
import { NextPageFile, ExtendedOptions } from './commonTypes';

export function loadPage({
  pagesDirectory,
  pagePath,
}: {
  pagesDirectory: string;
  pagePath: string;
}): NextPageFile {
  // @NOTE Here we have to remove pagePath's trailing "/"
  return require(path.resolve(pagesDirectory, pagePath.substring(1)));
}

export async function loadPageWithUnknownExtension<FileType>({
  pagePath,
  options: { pagesDirectory, pageExtensions },
}: {
  pagePath: string;
  options: ExtendedOptions;
}): Promise<FileType | undefined> {
  const pageExtensionGlobPattern = `.{${pageExtensions.join(',')}}`;
  const files = await fastGlob([
    pagesDirectory + pagePath + pageExtensionGlobPattern,
  ]);
  if (!files.length) {
    return;
  }
  return require(files[0]);
}
