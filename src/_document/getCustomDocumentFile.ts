import type { ExtendedOptions, NextCustomDocumentFile } from '../commonTypes';
import { loadPageWithUnknownExtension } from '../loadPage';
import { DOCUMENT_PATH } from '../constants';

export default function getFile({
  options,
}: {
  options: ExtendedOptions;
}): NextCustomDocumentFile | undefined {
  return loadPageWithUnknownExtension<NextCustomDocumentFile>({
    options,
    pagePath: DOCUMENT_PATH,
  });
}
