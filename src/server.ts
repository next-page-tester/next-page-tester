import { RuntimeEnvironment } from './constants';
import setNextRuntimeConfig from './setNextRuntimeConfig';
import { setEnvVars } from './setEnvVars';
import { executeWithFreshModules } from './utils';

function hideBrowserEnv(): () => void {
  const tmpWindow = global.window;
  const tmpDocument = global.document;

  // @ts-expect-error its okay
  delete global.window;
  // @ts-expect-error its okay
  delete global.document;
  setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.SERVER });
  setEnvVars({ runtimeEnv: RuntimeEnvironment.SERVER });

  return () => {
    global.window = tmpWindow;
    global.document = tmpDocument;
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

export const requireAsIfOnServer = <FileType>({
  path,
}: {
  path: string;
}): FileType => {
  return executeWithFreshModules(() => {
    return executeAsIfOnServerSync<FileType>(() => require(path));
  });
};
