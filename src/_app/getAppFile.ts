import path from 'path';
import type { ExtendedOptions, NextAppFile, PageFile } from '../commonTypes';
import { loadPageIfExists, loadFile } from '../loadPage';
import { APP_PATH } from '../constants';

export function getAppFile({
  options,
}: {
  options: ExtendedOptions;
}): PageFile<NextAppFile> {
  const { useApp, nonIsolatedModules } = options;
  if (useApp) {
    const customAppFile = loadPageIfExists<NextAppFile>({
      pagePath: APP_PATH,
      options,
    });

    if (customAppFile) {
      return customAppFile;
    }
  }
  return getDefaultAppFile({ nonIsolatedModules });
}

function getDefaultAppFile({
  nonIsolatedModules,
}: {
  nonIsolatedModules: string[];
}): PageFile<NextAppFile> {
  return loadFile<NextAppFile>({
    absolutePath: path.resolve(__dirname, 'DefaultApp'),
    nonIsolatedModules,
  });
}
