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
  } catch (e: unknown) {
    /* istanbul ignore else */
    if (e instanceof Error) {
      const internalError = new InternalError(
        `Failed to load "${pagePath}" file due to ${e.name}: ${e.message}`
      );
      internalError.stack = e.stack;
      throw internalError;
    } else if (e && typeof e === 'object' && 'message' in e) {
      // Jest can throw errors as pure objects, to provide better information
      // we need to include the original message in the thrown error.
      // See https://github.com/toomuchdesign/next-page-tester/issues/269
      throw new InternalError(
        `Failed to load "${pagePath}"\n\n${(e as Error).message}`
      );
    }

    /* istanbul ignore next */
    throw new InternalError(`Failed to load "${pagePath}"`);
  }
}
