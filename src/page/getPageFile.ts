import path from 'path';
import { existsSync } from 'fs';
import type { ExtendedOptions } from '../commonTypes';
import { InternalError } from '../_error';
import { loadFile } from '../loadFile';

type GetPageOptions = {
  pagePath: string;
  options: ExtendedOptions;
};

// Path only versions
// @TODO Consider renaming getPageAbsolutePath
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

export function getPageFile<FileType>({
  pagePath,
  options,
}: GetPageOptions): FileType {
  return loadFile({
    absolutePath: getPagePath({ pagePath, options }),
  });
}

export function getPageFileIfExists<FileType>(
  options: GetPageOptions
): FileType | undefined {
  try {
    return getPageFile(options);
  } catch (e) {
    return undefined;
  }
}
