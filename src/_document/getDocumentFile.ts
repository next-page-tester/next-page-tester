import type { ExtendedOptions, NextDocumentFile } from '../commonTypes';
import { loadFile } from '../loadFile';
import { getPageFileIfExists } from '../page';
import { DOCUMENT_PATH } from '../constants';

export async function getDocumentFile({
  options,
}: {
  options: ExtendedOptions;
}): Promise<NextDocumentFile> {
  const customDocumentFile = await getPageFileIfExists<NextDocumentFile>({
    options,
    pagePath: DOCUMENT_PATH,
  });

  if (customDocumentFile) {
    return customDocumentFile;
  }

  return getDefaultDocumentFile();
}

async function getDefaultDocumentFile(): Promise<NextDocumentFile> {
  return await loadFile<NextDocumentFile>({
    absolutePath: 'next/document',
  });
}
