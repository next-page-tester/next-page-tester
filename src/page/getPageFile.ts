import path from 'path';
import { existsSync } from 'fs';
import type { ExtendedOptions, PageFile } from '../commonTypes';
import { InternalError } from '../_error/error';
import { loadFile, loadSingleFile } from '../loadFile';

type GetPageOptions = {
  pagePath: string;
  options: ExtendedOptions;
};

// Path only versions
export function getPagePath({
  pagePath,
  options: { pageExtensions, pagesDirectory },
}: GetPageOptions): string {
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));

  for (const pageExtension of pageExtensions) {
    const pathWithExtension = absolutePath + `.${pageExtension}`;
    if (existsSync(pathWithExtension)) {
      return pathWithExtension;
    }
  }

  throw new InternalError(
    "Couldn't find required page file with matching extension"
  );
}

export function getPagePathIfExists(
  options: GetPageOptions
): string | undefined {
  try {
    return getPagePath(options);
  } catch (e) {
    return undefined;
  }
}

export function getSinglePageFile<FileType>({
  pagePath,
  options,
}: GetPageOptions): FileType {
  return loadSingleFile({
    absolutePath: getPagePath({ pagePath, options }),
  });
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
  options,
}: GetPageOptions): PageFile<FileType> {
  const absolutePath = getPagePath({ pagePath, options });
  const { nonIsolatedModules } = options;
  return loadFile({ absolutePath, nonIsolatedModules });
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
