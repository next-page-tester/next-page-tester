import path from 'path';
import { existsSync } from 'fs';
import type { ExtendedOptions, PageFile } from '../commonTypes';
import { InternalError } from '../_error/error';
import { loadFile, loadSingleFile } from '../loadFile';

type GetPageOptions = {
  pagePath: string;
  options: ExtendedOptions;
};

export function getSinglePageFile<FileType>({
  pagePath,
  options: { pageExtensions, pagesDirectory },
}: GetPageOptions): FileType {
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));

  for (const pageExtension of pageExtensions) {
    const pathWithExtension = absolutePath + `.${pageExtension}`;
    if (existsSync(pathWithExtension)) {
      return loadSingleFile({
        absolutePath: pathWithExtension,
      });
    }
  }

  throw new InternalError(
    "Couldn't find required page file with matching extension"
  );
}

export function getSinglePageFileIfExists<FileType>(
  options: GetPageOptions
): FileType | undefined {
  try {
    return getSinglePageFile(options);
  } catch (e) {
    return undefined;
  }
}

export function getPageFile<FileType>({
  pagePath,
  options: { pageExtensions, pagesDirectory, nonIsolatedModules },
}: GetPageOptions): PageFile<FileType> {
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));

  for (const pageExtension of pageExtensions) {
    const pathWithExtension = absolutePath + `.${pageExtension}`;
    if (existsSync(pathWithExtension)) {
      return loadFile({ absolutePath: pathWithExtension, nonIsolatedModules });
    }
  }

  throw new InternalError(
    "Couldn't find required page file with matching extension"
  );
}

export function getPageFileIfExists<FileType>(
  options: GetPageOptions
): PageFile<FileType> | undefined {
  try {
    return getPageFile(options);
  } catch (e) {
    return undefined;
  }
}
