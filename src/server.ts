import path from 'path';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { jestIsolateModules } from './utils';
import type { ExtendedOptions, NextPageFile } from './commonTypes';

const pages = new Map<string, NextPageFile>();
export async function loadPagesModules({
  options,
}: {
  options: ExtendedOptions;
}) {
  const { pagesDirectory, pageExtensions } = options;
  const paths = await fastGlob([
    normalizePath(path.join(pagesDirectory, '**', '*')),
  ]);
  // Filter out files without valid extensions
  const extensionsRegex = new RegExp(`\.(${pageExtensions.join('|')})$`);
  const pagePaths = paths.filter((filePath) => filePath.match(extensionsRegex));

  return jestIsolateModules(() => {
    executeAsIfOnServerSync(() => {
      for (const pagePath of pagePaths) {
        const page = require(pagePath);
        const pagePathWithoutExtension = pagePath.replace(extensionsRegex, '');
        pages.set(pagePathWithoutExtension, page);
      }
    });
  });
}

export function getServerPage({ path }: { path: string }) {
  const page = pages.get(path);
  if (!page) {
    throw new Error(
      `[next page tester] Server could not find page under path ${path}`
    );
  }
  return page;
}

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

export const executeAsIfOnServerSync = <T>(f: () => T) => {
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
