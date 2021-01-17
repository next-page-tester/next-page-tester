import path from 'path';
import { existsSync } from 'fs';
import { requireAsIfOnServer } from './server';
import type { ExtendedOptions, PageFile } from './commonTypes';
import { InternalError } from './_error/error';

export function loadFile<FileType>({
  absolutePath,
}: {
  absolutePath: string;
}): PageFile<FileType> {
  return {
    client: require(absolutePath),
    server: requireAsIfOnServer<FileType>(absolutePath),
  };
}

type LoadPageOptions = Pick<
  ExtendedOptions,
  'pageExtensions' | 'pagesDirectory'
> & {
  pagePath: string;
};

export function loadPage<FileType>({
  pagePath,
  pageExtensions,
  pagesDirectory,
}: LoadPageOptions): PageFile<FileType> {
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));

  for (const pageExtension of pageExtensions) {
    const pathWithExtension = absolutePath + `.${pageExtension}`;
    if (existsSync(pathWithExtension)) {
      return loadFile({ absolutePath: pathWithExtension });
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
