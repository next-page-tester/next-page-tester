import path from 'path';
import { ExtendedOptions, PageFile } from './commonTypes';
import { requireAsIfOnServer } from './server';

export function loadPage<FileType>({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): PageFile<FileType> {
  const { pagesDirectory } = options;
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));
  return {
    client: require(absolutePath),
    server: requireAsIfOnServer<FileType>(absolutePath),
  };
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
