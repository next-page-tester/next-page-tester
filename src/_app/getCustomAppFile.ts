import type { ExtendedOptions, NextCustomAppFile } from '../commonTypes';
import { loadPageWithUnknownExtension } from '../loadPage';
import { APP_PATH } from '../constants';

export default function getCustomAppFile({
  options,
}: {
  options: ExtendedOptions;
}): NextCustomAppFile | undefined {
  return loadPageWithUnknownExtension<NextCustomAppFile>({
    options,
    pagePath: APP_PATH,
  });
}
