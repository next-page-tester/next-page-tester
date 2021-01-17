import path from 'path';
import type { ExtendedOptions, NextAppFile, PageFile } from '../commonTypes';
import { loadPageIfExists, loadFile } from '../loadPage';
import { APP_PATH } from '../constants';
// @NOTE: DefaultApp is imported only to make it available in dist folder
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DefaultApp from './DefaultApp';

export function getAppFile({
  pageExtensions,
  pagesDirectory,
  useApp,
}: Pick<
  ExtendedOptions,
  'pageExtensions' | 'pagesDirectory' | 'useApp'
>): PageFile<NextAppFile> {
  if (useApp) {
    const customAppFile = loadPageIfExists<NextAppFile>({
      pagePath: APP_PATH,
      pageExtensions,
      pagesDirectory,
    });

    if (customAppFile) {
      return customAppFile;
    }
  }
  return getDefaultAppFile();
}

function getDefaultAppFile(): PageFile<NextAppFile> {
  return loadFile<NextAppFile>({
    absolutePath: path.resolve(__dirname, 'DefaultApp'),
  });
}
