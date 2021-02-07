import path from 'path';
import type { ExtendedOptions, NextAppFile, PageFile } from '../commonTypes';
import { loadFile, loadSingleFile } from '../loadFile';
import { getPageFileIfExists, getSinglePageFileIfExists } from '../page';
import { APP_PATH } from '../constants';

export function getSingleAppFile({
  options,
}: {
  options: ExtendedOptions;
}): NextAppFile {
  const { useApp } = options;
  if (useApp) {
    const customAppFile = getSinglePageFileIfExists<NextAppFile>({
      pagePath: APP_PATH,
      options,
    });

    if (customAppFile) {
      return customAppFile;
    }
  }
  return getDefaultSingleAppFile();
}

function getDefaultSingleAppFile(): NextAppFile {
  return loadSingleFile<NextAppFile>({
    absolutePath: path.resolve(__dirname, 'DefaultApp'),
  });
}

export function getAppFile({
  options,
}: {
  options: ExtendedOptions;
}): PageFile<NextAppFile> {
  const { useApp, nonIsolatedModules } = options;
  if (useApp) {
    const customAppFile = getPageFileIfExists<NextAppFile>({
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
