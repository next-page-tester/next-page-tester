import path from 'path';
import type { ExtendedOptions, NextAppFile } from '../commonTypes';
import { loadFile } from '../loadFile';
import { getPageFileIfExists } from '../page';
import { APP_PATH } from '../constants';

export async function getAppFile({
  options,
}: {
  options: ExtendedOptions;
}): Promise<NextAppFile> {
  const { useApp } = options;
  if (useApp) {
    const customAppFile = await getPageFileIfExists<NextAppFile>({
      pagePath: APP_PATH,
      options,
    });

    if (customAppFile) {
      return customAppFile;
    }
  }
  return await getDefaultAppFile();
}

async function getDefaultAppFile(): Promise<NextAppFile> {
  return await loadFile<NextAppFile>({
    absolutePath: path.resolve(__dirname, 'DefaultApp'),
  });
}
