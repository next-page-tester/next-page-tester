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
function loadPageFiles<PageFile extends NextFile>({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): NextPageFiles<PageFile> {
  const { wrappers } = options;
  return {
    documentFile: getDocumentFile({ options }),
    appFile: getAppFile({ options }),
    pageFile: loadFile<PageFile>({
      absolutePath: absolutePagePath,
    }),
    wrappersFile: wrappers
      ? loadFile<WrappersFile>({
          absolutePath: wrappers,
        })
      : undefined,
  };
}

export function loadExistingPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): MultiEnv<NextExistingPageFiles> {
  return {
    client: loadPageFiles({ absolutePagePath, options }),
    server: executeAsIfOnServerSync(() =>
      executeWithFreshModules(
        () => loadPageFiles({ absolutePagePath, options }),
        options
      )
    ),
  };
}

export function loadErrorPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): MultiEnv<NextErrorPageFiles> {
  return {
    client: loadPageFiles({ absolutePagePath, options }),
    server: executeAsIfOnServerSync(() =>
      executeWithFreshModules(
        () => loadPageFiles({ absolutePagePath, options }),
        options
      )
    ),
  };
}
