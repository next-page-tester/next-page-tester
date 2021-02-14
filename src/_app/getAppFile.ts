import path from 'path';
import type { ExtendedOptions, NextAppFile } from '../commonTypes';
import { loadFile } from '../loadFile';
import { getPageFileIfExists } from '../page';
import { APP_PATH } from '../constants';

export function getAppFile({
  options,
}: {
  options: ExtendedOptions;
}): NextAppFile {
  const { useApp } = options;
  if (useApp) {
    const customAppFile = getPageFileIfExists<NextAppFile>({
      pagePath: APP_PATH,
      options,
    });

    if (customAppFile) {
      return customAppFile;
    }
  }
  return getDefaultAppFile();
}

function getDefaultAppFile(): NextAppFile {
  return loadFile<NextAppFile>({
    absolutePath: path.resolve(__dirname, 'DefaultApp'),
  });
}
