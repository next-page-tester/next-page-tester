import path from 'path';
import { NextPageFile } from './commonTypes';

function loadPage({
  pagesDirectory,
  pagePath,
}: {
  pagesDirectory: string;
  pagePath: string;
}): NextPageFile {
  // @NOTE Here we have to remove pagePath's trailing "/"
  return require(path.resolve(pagesDirectory, pagePath.substring(1)));
}

export default loadPage;
