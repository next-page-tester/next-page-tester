import type {
  ExtendedOptions,
  NextDocumentFile,
  PageFile,
} from '../commonTypes';
import { loadPageIfExists, loadFile } from '../loadPage';
import { DOCUMENT_PATH } from '../constants';

export default function getDocumentFile({
  pageExtensions,
  pagesDirectory,
}: Pick<
  ExtendedOptions,
  'pageExtensions' | 'pagesDirectory'
>): PageFile<NextDocumentFile> {
  const customDocumentFile = loadPageIfExists<NextDocumentFile>({
    pagePath: DOCUMENT_PATH,
    pageExtensions,
    pagesDirectory,
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
