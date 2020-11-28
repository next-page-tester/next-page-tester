import type { ExtendedOptions, NextCustomDocumentFile } from '../commonTypes';
import { loadPageWithUnknownExtension } from '../loadPage';
import { DOCUMENT_PATH } from '../constants';

export default async function getFile({
  options,
}: {
  options: ExtendedOptions;
}): Promise<NextCustomDocumentFile | undefined> {
  return await loadPageWithUnknownExtension<NextCustomDocumentFile>({
    options,
    pagePath: DOCUMENT_PATH,
  });
}
