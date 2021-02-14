import { getSingleDocumentFile } from './_document';
import { getSingleAppFile } from './_app';
import { loadSingleFile } from './loadFile';
import { executeWithFreshModules } from './utils';
import { executeAsIfOnServerSync } from './server';
import type {
  ExtendedOptions,
  NextPageFiles,
  NextErrorPageFiles,
  MultiEnv,
} from './commonTypes';

// Get Document, App and Page files
// @TODO Find a way to avoid this duplication and let TS follow pageFile typing
function getNextPageFiles({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): NextPageFiles {
  return {
    documentFile: getSingleDocumentFile({ options }),
    appFile: getSingleAppFile({ options }),
    pageFile: loadSingleFile({
      absolutePath: pagePath,
    }),
  };
}

function getNextErrorPageFiles({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): NextErrorPageFiles {
  return {
    documentFile: getSingleDocumentFile({ options }),
    appFile: getSingleAppFile({ options }),
    pageFile: loadSingleFile({
      absolutePath: pagePath,
    }),
  };
}

export function getMultiEnvNextPageFiles({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): MultiEnv<NextPageFiles> {
  const { nonIsolatedModules } = options;
  return {
    client: getNextPageFiles({ pagePath, options }),
    server: executeAsIfOnServerSync(() =>
      executeWithFreshModules(() => getNextPageFiles({ pagePath, options }), {
        nonIsolatedModules,
      })
    ),
  };
}

export function getMultiEnvNextErrorPageFiles({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): MultiEnv<NextErrorPageFiles> {
  const { nonIsolatedModules } = options;
  return {
    client: getNextErrorPageFiles({ pagePath, options }),
    server: executeAsIfOnServerSync(() =>
      executeWithFreshModules(
        () => getNextErrorPageFiles({ pagePath, options }),
        {
          nonIsolatedModules,
        }
      )
    ),
  };
}
