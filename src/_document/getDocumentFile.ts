import type { ExtendedOptions, NextDocumentFile } from '../commonTypes';
import { loadSingleFile } from '../loadFile';
import { getSinglePageFileIfExists } from '../page';
import { DOCUMENT_PATH } from '../constants';

export function getSingleDocumentFile({
  options,
}: {
  options: ExtendedOptions;
}): NextDocumentFile {
  const customDocumentFile = getSinglePageFileIfExists<NextDocumentFile>({
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
