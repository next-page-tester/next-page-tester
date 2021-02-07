import path from 'path';
import { existsSync } from 'fs';
import { requireAsIfOnServer } from './server';
import type { ExtendedOptions, PageFile } from './commonTypes';
import { InternalError } from './_error/error';

export function loadSingleFile<FileType>({
  absolutePath,
}: {
  absolutePath: string;
}): FileType {
  return require(absolutePath);
}

export function loadSinglePage<FileType>({
  pagePath,
  options: { pageExtensions, pagesDirectory },
}: LoadPageOptions): FileType {
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));

  for (const pageExtension of pageExtensions) {
    const pathWithExtension = absolutePath + `.${pageExtension}`;
    if (existsSync(pathWithExtension)) {
      return loadSingleFile({
        absolutePath: pathWithExtension,
      });
    }
  }

  throw new InternalError(
    "Couldn't find required page file with matching extension"
  );
}

export function loadSinglePageIfExists<FileType>(
  options: LoadPageOptions
): FileType | undefined {
  try {
    return loadSinglePage(options);
  } catch (e) {
    return undefined;
  }
}

export function loadFile<FileType>({
  absolutePath,
  nonIsolatedModules,
}: {
  absolutePath: string;
  nonIsolatedModules: string[];
}): PageFile<FileType> {
  return {
    client: require(absolutePath),
    server: requireAsIfOnServer<FileType>({
      path: absolutePath,
      nonIsolatedModules,
    }),
    path: absolutePath,
  };
}

type LoadPageOptions = {
  pagePath: string;
  options: ExtendedOptions;
};

export function loadPage<FileType>({
  pagePath,
  options: { pageExtensions, pagesDirectory, nonIsolatedModules },
}: LoadPageOptions): PageFile<FileType> {
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));

  for (const pageExtension of pageExtensions) {
    const pathWithExtension = absolutePath + `.${pageExtension}`;
    if (existsSync(pathWithExtension)) {
      return loadFile({ absolutePath: pathWithExtension, nonIsolatedModules });
    }
  }

  throw new InternalError(
    "Couldn't find required page file with matching extension"
  );
}

export function loadPageIfExists<FileType>(
  options: LoadPageOptions
): PageFile<FileType> | undefined {
  try {
    return loadPage(options);
  } catch (e) {
    return undefined;
  }
}
