import { getDocumentFile } from './_document';
import { getAppFile } from './_app';
import { loadFile } from './loadFile';
import { executeWithFreshModules } from './utils';
import { executeAsIfOnServerSync } from './server';
import type {
  ExtendedOptions,
  NextExistingPageFiles,
  NextErrorPageFiles,
  MultiEnv,
  NextFile,
  NextPageFiles,
  WrappersFile,
} from './commonTypes';

// Get Document, App and Page files
async function loadPageFiles<PageFile extends NextFile>({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): Promise<NextPageFiles<PageFile>> {
  const { wrappers } = options;
  return {
    documentFile: await getDocumentFile({ options }),
    appFile: await getAppFile({ options }),
    pageFile: await loadFile<PageFile>({
      absolutePath: absolutePagePath,
    }),
    wrappersFile: wrappers
      ? await loadFile<WrappersFile>({
          absolutePath: wrappers,
        })
      : undefined,
  };
}

export async function loadExistingPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): Promise<MultiEnv<NextExistingPageFiles>> {
  return {
    client: await loadPageFiles({ absolutePagePath, options }),
    server: await executeAsIfOnServerSync(() =>
      executeWithFreshModules(
        () => loadPageFiles({ absolutePagePath, options }),
        options
      )
    ),
  };
}

export async function loadErrorPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): Promise<MultiEnv<NextErrorPageFiles>> {
  return {
    client: await loadPageFiles({ absolutePagePath, options }),
    server: await executeAsIfOnServerSync(() =>
      executeWithFreshModules(
        () => loadPageFiles({ absolutePagePath, options }),
        options
      )
    ),
  };
}
