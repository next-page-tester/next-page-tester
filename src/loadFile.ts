import { requireAsIfOnServer } from './server';
import type { PageFile } from './commonTypes';

export function loadSingleFile<FileType>({
  absolutePath,
}: {
  absolutePath: string;
}): FileType {
  return require(absolutePath);
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
