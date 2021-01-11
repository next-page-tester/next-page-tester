import type { ExtendedOptions, NextAppFile } from '../commonTypes';
import { loadPageIfExists } from '../loadPage';
import { ERROR_PATH } from '../constants';

export default function getCustomErrorFile({
  options,
}: {
  options: ExtendedOptions;
}) {
  return loadPageIfExists<NextAppFile>({
    pagePath: ERROR_PATH,
    options,
  });
}
