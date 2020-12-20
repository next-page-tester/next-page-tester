import type { ExtendedOptions, NextCustomAppFile } from '../commonTypes';
import { loadPageIfExists } from '../loadPage';
import { APP_PATH } from '../constants';

export default function getCustomAppFile({
  options,
}: {
  options: ExtendedOptions;
}) {
  return loadPageIfExists<NextCustomAppFile>({
    pagePath: APP_PATH,
    options,
  });
}
