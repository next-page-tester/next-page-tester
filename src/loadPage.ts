import path from 'path';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { NextPageFile, ExtendedOptions } from './commonTypes';
import { executeAsIfOnServer } from './server';

async function evaluateNextJsImportsAsIfOnServer() {
  return executeAsIfOnServer(() => {
    // https://github.com/vercel/next.js/blob/v10.0.3/packages/next/next-server/lib/side-effect.tsx#L3
    require('next/dist/next-server/lib/side-effect');
  });
}

export async function loadPage({
  pagesDirectory,
  pagePath,
  useDocument,
}: {
  pagesDirectory: string;
  pagePath: string;
  useDocument: boolean;
}): Promise<NextPageFile> {
  // Even though there are places in code where this code would make more sense, it has to be called
  // before the page is loaded. The problem is that once the page is loaded, all modules get resolved (including NextJS)
  // and we cannot influence their top level expressions anymore
  if (useDocument) {
    await evaluateNextJsImportsAsIfOnServer();
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
