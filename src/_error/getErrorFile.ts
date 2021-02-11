import path from 'path';
import type { ExtendedOptions } from '../commonTypes';
import { getPagePathIfExists } from '../page';
import { ERROR_PATH } from '../constants';

const defaultErrorPagePath = path.resolve(__dirname, 'DefaultError');

// Path only versions
export function getErrorPagePath({
  options,
}: {
  options: ExtendedOptions;
}): string {
  const customErrorFile = getPagePathIfExists({
    pagePath: ERROR_PATH,
    options,
  });

  if (customErrorFile) {
    return customErrorFile;
  }

  return defaultErrorPagePath;
}
