import path from 'path';
import type { ExtendedOptions, NextAppFile, PageFile } from '../commonTypes';
import {
  loadPageIfExists,
  loadSinglePageIfExists,
  loadFile,
  loadSingleFile,
} from '../loadPage';
import { APP_PATH } from '../constants';

export function getSingleAppFile({
  options,
}: {
  options: ExtendedOptions;
}): NextAppFile {
  const { useApp } = options;
  if (useApp) {
    const customAppFile = loadSinglePageIfExists<NextAppFile>({
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
