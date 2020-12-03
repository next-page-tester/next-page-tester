import path from 'path';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { NextPageFile, ExtendedOptions } from './commonTypes';

function resolveNextJsModulesAsIfOnServer() {
  const tmpWindow = global.window;

  // Next.JS executes some rendering logic conditionally, depending if its on server.
  // https://github.com/vercel/next.js/blob/v10.0.3/packages/next/next-server/lib/side-effect.tsx#L3
  // We want that logic to execute, so we have to trick it to think code is executing on server
  // Because expression is evaluated on module's top level, therefore we have to "mock" it before module is evaluated -- before require is called;
  // @ts-ignore
  delete global.window;

  require('next/dist/next-server/lib/side-effect');

  // Restore window object -- required for client side navigation, etc...
  global.window = tmpWindow;
}

export function loadPage({
  pagesDirectory,
  pagePath,
  useDocument,
}: {
  pagesDirectory: string;
  pagePath: string;
  useDocument: boolean;
}): NextPageFile {
  // Even though there are places in code where this code would make more sense, it has to be called
  // before the page is loaded. The problem is that once the page is loaded, all modules get resolved (including NextJS)
  // and we cannot influence their top level expressions anymore
  if (useDocument) {
    resolveNextJsModulesAsIfOnServer();
  }

  // @NOTE Here we have to remove pagePath's trailing "/"
  return require(path.resolve(pagesDirectory, pagePath.substring(1)));
}

export async function loadPageWithUnknownExtension<FileType>({
  pagePath,
  options: { pagesDirectory, pageExtensions },
}: {
  pagePath: string;
  options: ExtendedOptions;
}): Promise<FileType | undefined> {
  const pageExtensionGlobPattern = `.{${pageExtensions.join(',')}}`;
  const files = await fastGlob([
    normalizePath(pagesDirectory + pagePath + pageExtensionGlobPattern),
  ]);

  if (!files.length) {
    return;
  }

  return require(files[0]);
}
