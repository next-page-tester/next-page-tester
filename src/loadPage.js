import path from 'path';

async function loadPage({ pagesDirectory, pagePath }) {
  const relativePagePath = pagePath.startsWith('/')
    ? pagePath.substring(1)
    : pagePath;
  return require(path.resolve(pagesDirectory, relativePagePath));
}

export default loadPage;
