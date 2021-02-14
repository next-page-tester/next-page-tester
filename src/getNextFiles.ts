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
function _loadExistingPageFiles({
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

function _loadErrorPageFiles({
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

export function loadExistingPageFiles({
  absolutePagePath,
  options,
}: {
  absolutePagePath: string;
  options: ExtendedOptions;
}): MultiEnv<NextExistingPageFiles> {
  return {
    client: _loadExistingPageFiles({ absolutePagePath, options }),
    server: executeAsIfOnServerSync(() =>
      executeWithFreshModules(() =>
        _loadExistingPageFiles({ absolutePagePath, options })
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
    client: _loadErrorPageFiles({ absolutePagePath, options }),
    server: executeAsIfOnServerSync(() =>
      executeWithFreshModules(() =>
        _loadErrorPageFiles({ absolutePagePath, options })
      )
    ),
  };
}
