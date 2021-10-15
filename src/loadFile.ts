import path from 'path';
import { InternalError } from './_error';

export function loadFile<FileType>({
  absolutePath,
}: {
  absolutePath: string;
}): FileType {
  try {
    return require(absolutePath);
  } catch (e: unknown) {
    const baseName = path.basename(absolutePath);

    if (e instanceof Error) {
      const internalError = new InternalError(
        `Failed to load "${baseName}" file due to ${e.name}: ${e.message}`
      );
      internalError.stack = e.stack;
      throw internalError;
    }

    if (e && typeof e === 'object' && 'message' in e) {
      // Jest can throw errors as pure objects, to provide better information
      // we need to include the original message in the thrown error.
      // See https://github.com/toomuchdesign/next-page-tester/issues/269
      throw new InternalError(
        `Failed to load "${baseName}" file due to: ${(e as Error).message}`
      );
    }

    /* istanbul ignore next */
    throw new InternalError(`Failed to load "${baseName}"`);
  }
}
