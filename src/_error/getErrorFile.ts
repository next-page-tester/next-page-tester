import type { ExtendedOptions } from '../commonTypes';
import { getPagePathIfExists } from '../page';
import { ERROR_PATH } from '../constants';

const defaultErrorPagePath = 'next/error';

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
