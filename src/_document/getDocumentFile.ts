import type { ExtendedOptions, NextDocumentFile } from '../commonTypes';
import { loadSinglePageIfExists, loadSingleFile } from '../loadPage';
import { DOCUMENT_PATH } from '../constants';

export function getSingleDocumentFile({
  options,
}: {
  options: ExtendedOptions;
}): NextDocumentFile {
  const customDocumentFile = loadSinglePageIfExists<NextDocumentFile>({
    options,
    pagePath: DOCUMENT_PATH,
  });

  if (customDocumentFile) {
    return customDocumentFile;
  }

  return getDefaultSingleDocumentFile();
}

function getDefaultSingleDocumentFile(): NextDocumentFile {
  return loadSingleFile<NextDocumentFile>({
    absolutePath: 'next/document',
  });
}
