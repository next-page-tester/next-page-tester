import type { ExtendedOptions, NextCustomDocumentFile } from '../commonTypes';
import { loadPageIfExists } from '../loadPage';
import { DOCUMENT_PATH } from '../constants';

export default function getCustomDocumentFile({
  options,
}: {
  options: ExtendedOptions;
}) {
  return loadPageIfExists<NextCustomDocumentFile>({
    options,
    pagePath: DOCUMENT_PATH,
  });
}
