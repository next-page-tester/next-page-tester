import path from 'path';

async function loadPage({ pagesDirectory, pagePath }) {
  // @NOTE Here we have to remove pagePath's trailing "/"
  return require(path.resolve(pagesDirectory, pagePath.substring(1)));
}

export default loadPage;
