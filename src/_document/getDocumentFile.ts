import type { ExtendedOptions, NextDocumentFile } from '../commonTypes';
import { loadFile } from '../loadFile';
import { getPageFileIfExists } from '../page';
import { DOCUMENT_PATH } from '../constants';

export function getDocumentFile({
  options,
}: {
  options: ExtendedOptions;
}): NextDocumentFile {
  const customDocumentFile = getPageFileIfExists<NextDocumentFile>({
    options,
    pagePath: DOCUMENT_PATH,
  });

  if (customDocumentFile) {
    return customDocumentFile;
  }

  return getDefaultDocumentFile();
}

function getDefaultDocumentFile(): NextDocumentFile {
  return loadFile<NextDocumentFile>({
    absolutePath: 'next/document',
  });
}
