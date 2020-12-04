export const executeAsIfOnServer = <T>(f: () => T) => {
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
