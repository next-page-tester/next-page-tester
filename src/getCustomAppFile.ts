import type { ExtendedOptions, NextCustomAppFile } from './commonTypes';
import { loadPageWithUnknownExtension } from './loadPage';

export default async function getCustomAppFile({
  options,
}: {
  options: ExtendedOptions;
}): Promise<NextCustomAppFile | undefined> {
  return await loadPageWithUnknownExtension<NextCustomAppFile>({
    options,
    pagePath: '/_app',
  });
}
