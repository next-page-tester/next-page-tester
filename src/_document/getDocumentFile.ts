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
  const { nonIsolatedModules } = options;
  const customDocumentFile = loadPageIfExists<NextDocumentFile>({
    pagePath: DOCUMENT_PATH,
    options,
  });

  if (customDocumentFile) {
    return customDocumentFile;
  }

  return getDefaultDocumentFile({ nonIsolatedModules });
}

function getDefaultDocumentFile({
  nonIsolatedModules,
}: {
  nonIsolatedModules: string[];
}): PageFile<NextDocumentFile> {
  return loadFile<NextDocumentFile>({
    absolutePath: 'next/document',
    nonIsolatedModules,
  });
}
