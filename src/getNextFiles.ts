import { getSingleDocumentFile } from './_document';
import { getSingleAppFile } from './_app';
import { loadSingleFile } from './loadFile';
import type {
  ExtendedOptions,
  NextPageFiles,
  NextErrorPageFiles,
} from './commonTypes';

// Get Document, App and Page files
// @TODO Find a way to avoid this duplication and let TS follow pageFile typing
export function getNextPageFiles({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): NextPageFiles {
  return {
    documentFile: getSingleDocumentFile({ options }),
    appFile: getSingleAppFile({ options }),
    pageFile: loadSingleFile({
      absolutePath: pagePath,
    }),
  };
}

export function getNextErrorPageFiles({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): NextErrorPageFiles {
  return {
    documentFile: getSingleDocumentFile({ options }),
    appFile: getSingleAppFile({ options }),
    pageFile: loadSingleFile({
      absolutePath: pagePath,
    }),
  };
}
