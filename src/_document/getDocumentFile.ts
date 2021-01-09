import type {
  ExtendedOptions,
  NextDocumentFile,
  PageFile,
} from '../commonTypes';
import { loadPageIfExists, loadFile } from '../loadPage';
import { DOCUMENT_PATH } from '../constants';

export default function getDocumentFile({
  options,
}: {
  options: ExtendedOptions;
}): PageFile<NextDocumentFile> {
  const customDocumentFile = loadPageIfExists<NextDocumentFile>({
    options,
    pagePath: DOCUMENT_PATH,
  });

  if (customDocumentFile) {
    return customDocumentFile;
  }

  return getDefaultDocumentFile();
}

function getDefaultDocumentFile(): PageFile<NextDocumentFile> {
  return loadFile<NextDocumentFile>({
    absolutePath: 'next/document',
  });
}
