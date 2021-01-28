import path from 'path';
import type { ExtendedOptions, PageFile, NextErrorFile } from '../commonTypes';
import { loadFile, loadPageIfExists } from '../loadPage';
import { ERROR_PATH } from '../constants';

export function getErrorFile({
  options,
}: {
  options: ExtendedOptions;
}): PageFile<NextErrorFile> {
  const { nonIsolatedModules } = options;
  const customErrorFile = loadPageIfExists<NextErrorFile>({
    pagePath: ERROR_PATH,
    options,
  });

  if (customErrorFile) {
    return customErrorFile;
  }

  return getDefaultErrorFile({ nonIsolatedModules });
}

function getDefaultErrorFile({
  nonIsolatedModules,
}: {
  nonIsolatedModules: string[];
}): PageFile<NextErrorFile> {
  return loadFile<NextErrorFile>({
    absolutePath: path.resolve(__dirname, 'DefaultError'),
    nonIsolatedModules,
  });
}
