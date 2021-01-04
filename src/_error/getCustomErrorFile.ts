import type { ExtendedOptions, NextCustomAppFile } from '../commonTypes';
import { loadPageIfExists } from '../loadPage';
import { ERROR_PATH } from '../constants';

export default function getCustomErrorFile({
  options,
}: {
  options: ExtendedOptions;
}) {
  return loadPageIfExists<NextCustomAppFile>({
    pagePath: ERROR_PATH,
    options,
  });
}
