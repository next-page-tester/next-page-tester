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
} from './commonTypes';

// Get Document, App and Page files
// @TODO Find a way to avoid this duplication and let TS follow pageFile typing
function getNextPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): NextExistingPageFiles {
  return {
    documentFile: getDocumentFile({ options }),
    appFile: getAppFile({ options }),
    pageFile: loadFile({
      absolutePath: absolutePagePath,
    }),
  };
}

function getNextErrorPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): NextErrorPageFiles {
  return {
    documentFile: getDocumentFile({ options }),
    appFile: getAppFile({ options }),
    pageFile: loadFile({
      absolutePath: absolutePagePath,
    }),
  };
}

export function getMultiEnvNextPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): MultiEnv<NextExistingPageFiles> {
  return {
    client: getNextPageFiles({ absolutePagePath, options }),
    server: executeAsIfOnServerSync(() =>
      executeWithFreshModules(() =>
        getNextPageFiles({ absolutePagePath, options })
      )
    ),
  };
}

export function getMultiEnvNextErrorPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): MultiEnv<NextErrorPageFiles> {
  return {
    client: getNextErrorPageFiles({ absolutePagePath, options }),
    server: executeAsIfOnServerSync(() =>
      executeWithFreshModules(() =>
        getNextErrorPageFiles({ absolutePagePath, options })
      )
    ),
  };
}
