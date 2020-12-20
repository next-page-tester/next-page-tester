import { executeWithFreshModules } from './utils';

export const requireAsIfOnServer = <FileType>(path: string): FileType => {
  return executeWithFreshModules(() => {
    return executeAsIfOnServerSync<FileType>(() => require(path));
  });
};

export const executeAsIfOnServer = async <T>(f: () => T) => {
  const tmpWindow = global.window;
  const tmpDocument = global.document;

  // @ts-ignore
  delete global.window;
  // @ts-ignore
  delete global.document;

  const result = await f();

  global.window = tmpWindow;
  global.document = tmpDocument;

  return result;
};

export const executeAsIfOnServerSync = <T>(f: () => T): T => {
  const tmpWindow = global.window;
  const tmpDocument = global.document;

  // @ts-ignore
  delete global.window;
  // @ts-ignore
  delete global.document;

  const result = f();

  global.window = tmpWindow;
  global.document = tmpDocument;

  return result;
};
