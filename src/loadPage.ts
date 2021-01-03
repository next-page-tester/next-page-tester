import path from 'path';
import { existsSync } from 'fs';
import { requireAsIfOnServer } from './server';
import type { ExtendedOptions, PageFile } from './commonTypes';

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

export function loadPage<FileType>({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): PageFile<FileType> {
  const { pagesDirectory, pageExtensions } = options;
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));

  for (let pageExtension of pageExtensions) {
    const pathWithExtension = absolutePath + `.${pageExtension}`;
    if (existsSync(pathWithExtension)) {
      return loadFile({ absolutePath: pathWithExtension });
    }
  }

  throw new Error(
    "[next page tester] Couldn't find required page file with matching extension"
  );
}

export function loadPageIfExists<FileType>({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): PageFile<FileType> | undefined {
  try {
    return loadPage({ pagePath, options });
  } catch (e) {
    return undefined;
  }
}
