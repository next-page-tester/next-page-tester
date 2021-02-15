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

export function getPageFileIfExists<FileType>({
  pagePath,
  options,
}: GetPageOptions): FileType | undefined {
  const absolutePath = getPagePathIfExists({ pagePath, options });
  if (!absolutePath) {
    return undefined;
  }

  try {
    return loadFile({ absolutePath });
  } catch (e) {
    const relativePath = absolutePath.replace(options.nextRoot, '');
    const internalEror = new InternalError(
      `Failed to load "${relativePath}" file due to ${e.name}: ${e.message}`
    );
    internalEror.stack = e.stack;
    throw internalEror;
  }
}
