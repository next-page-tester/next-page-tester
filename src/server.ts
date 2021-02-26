import fetch from 'cross-fetch';

import { RuntimeEnvironment } from './constants';
import setNextRuntimeConfig from './setNextRuntimeConfig';
import { setEnvVars } from './setEnvVars';

function hideBrowserEnv(): () => void {
  const tmpWindow = global.window;
  const tmpDocument = global.document;
  const tmpfetch = global.fetch;
  global.fetch = fetch;

  // @ts-expect-error its okay
  delete global.window;
  // @ts-expect-error its okay
  delete global.document;
  setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.SERVER });
  setEnvVars({ runtimeEnv: RuntimeEnvironment.SERVER });

  return () => {
    global.window = tmpWindow;
    global.document = tmpDocument;
    global.fetch = tmpfetch;

    setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.CLIENT });
    setEnvVars({ runtimeEnv: RuntimeEnvironment.CLIENT });
  };
}

export const executeAsIfOnServer = async <T>(f: () => T) => {
  const restoreBrowserEnv = hideBrowserEnv();
  try {
    return await f();
  } finally {
    restoreBrowserEnv();
  }
};

export const executeAsIfOnServerSync = <T>(f: () => T): T => {
  const restoreBrowserEnv = hideBrowserEnv();
  try {
    return f();
  } finally {
    restoreBrowserEnv();
  }
};
