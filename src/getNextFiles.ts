import { getDocumentFile } from './_document';
import { getAppFile } from './_app';
import { loadFile } from './loadFile';
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
    documentFile: getDocumentFile({ options }),
    appFile: getAppFile({ options }),
    pageFile: loadFile({
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
    documentFile: getDocumentFile({ options }),
    appFile: getAppFile({ options }),
    pageFile: loadFile({
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
