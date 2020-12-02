import type { ExtendedOptions, NextCustomAppFile } from '../commonTypes';
import { loadPageWithUnknownExtension } from '../loadPage';
import { APP_PATH } from '../constants';

export default async function getCustomAppFile({
  options,
}: {
  options: ExtendedOptions;
}): Promise<NextCustomAppFile | undefined> {
  return await loadPageWithUnknownExtension<NextCustomAppFile>({
    options,
    pagePath: APP_PATH,
  });
}
