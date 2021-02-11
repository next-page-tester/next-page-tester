import type { ExtendedOptions, PageFile, NextErrorFile } from '../commonTypes';
import { getPagePathIfExists } from '../page';
import { loadFile } from '../loadFile';
import { FOUR_O_FOUR_PATH } from '../constants';
import { getErrorPagePath } from '../_error/getErrorFile';

export function get404PageFile({
  options,
}: {
  options: ExtendedOptions;
}): PageFile<NextErrorFile> {
  const { nonIsolatedModules } = options;
  const pagePath = get404PagePath({ options });
  return loadFile({ absolutePath: pagePath, nonIsolatedModules });
}

export function get404PagePath({
  options,
}: {
  options: ExtendedOptions;
}): string {
  const custom404file = getPagePathIfExists({
    pagePath: FOUR_O_FOUR_PATH,
    options,
  });

  if (custom404file) {
    return custom404file;
  }

  // Fallback to "/pages/_error" if no "/pages/404" is present
  return getErrorPagePath({ options });
}
