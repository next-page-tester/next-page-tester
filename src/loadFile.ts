import path from 'path';
import { InternalError } from './_error';

// Jest seems to throw errors which are not Error Instances.
// To provide better information
// we need to include the original message in the thrown error.
// See https://github.com/toomuchdesign/next-page-tester/issues/269
function seemsJestError(e: unknown): boolean {
  return Boolean(e && typeof e === 'object' && 'message' in e);
}

export async function loadFile<FileType>({
  absolutePath,
}: {
  absolutePath: string;
}): Promise<FileType> {
  try {
    return await import(absolutePath);
  } catch (e: unknown) {
    const baseName = path.basename(absolutePath);

    // @NOTE There are tests covering it but tests coverage seems to not see it
    /* istanbul ignore next */
    if (e instanceof Error || seemsJestError(e)) {
      const error = e as Error;
      const internalError = new InternalError(
        `Failed to load "${baseName}" file due to ${error.name}: ${error.message}`
      );
      internalError.stack = error.stack;
      throw internalError;
    }

    /* istanbul ignore next */
    throw new InternalError(`Failed to load "${baseName}"`);
  }
}
