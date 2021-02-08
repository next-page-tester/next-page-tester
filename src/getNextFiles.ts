import { getSingleDocumentFile } from './_document';
import { getSingleAppFile } from './_app';
import { loadSingleFile } from './loadFile';
import type {
  ExtendedOptions,
  NextFiles,
  GenericPageFileType,
} from './commonTypes';

// Get Document, App and Page files
export function getNextFiles<PageFileType = GenericPageFileType>({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): NextFiles<PageFileType> {
  return {
    documentFile: getSingleDocumentFile({ options }),
    appFile: getSingleAppFile({ options }),
    pageFile: loadSingleFile<PageFileType>({
      absolutePath: pagePath,
    }),
  };
}
