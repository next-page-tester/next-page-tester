import { RuntimeEnvironment } from './constants';
import setNextRuntimeConfig from './setNextRuntimeConfig';
import { executeWithFreshModules } from './utils';

export const requireAsIfOnServer = <FileType>({
  path,
  nonIsolatedModules,
}: {
  path: string;
  nonIsolatedModules: string[];
}): FileType => {
  return executeWithFreshModules(() => {
    return executeAsIfOnServerSync<FileType>(() => require(path));
  }, nonIsolatedModules);
};

export const executeAsIfOnServer = async <T>(f: () => T) => {
  const tmpWindow = global.window;
  const tmpDocument = global.document;

  // @ts-expect-error its okay
  delete global.window;
  // @ts-expect-error its okay
  delete global.document;
  setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.SERVER });

  try {
    return await f();
  } finally {
    global.window = tmpWindow;
    global.document = tmpDocument;
    setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.CLIENT });
  }
};

export const executeAsIfOnServerSync = <T>(f: () => T): T => {
  const tmpWindow = global.window;
  const tmpDocument = global.document;

  // @ts-expect-error its okay
  delete global.window;
  // @ts-expect-error its okay
  delete global.document;
  setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.SERVER });

  try {
    return f();
  } finally {
    global.window = tmpWindow;
    global.document = tmpDocument;
    setNextRuntimeConfig({ runtimeEnv: RuntimeEnvironment.CLIENT });
  }
};
