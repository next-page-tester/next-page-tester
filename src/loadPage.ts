import path from 'path';
import { existsSync } from 'fs';
import { ExtendedOptions } from './commonTypes';

export function loadPage<FileType>({
  pagePath,
  options,
}: {
  pagePath: string;
  options: ExtendedOptions;
}): FileType {
  const { pagesDirectory, pageExtensions } = options;
  // @NOTE Here we have to remove pagePath's leading "/"
  const absolutePath = path.resolve(pagesDirectory, pagePath.substring(1));

  for (let pageExtension of pageExtensions) {
    const pathWithExtension = absolutePath + `.${pageExtension}`;
    if (existsSync(pathWithExtension)) {
      return require(pathWithExtension);
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
}): FileType | undefined {
  try {
    return loadPage({ pagePath, options });
  } catch (e) {
    return undefined;
  }
}
