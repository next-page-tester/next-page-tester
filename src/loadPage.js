import path from 'path';

async function getPages({ pagesDirectory, pagePath }) {
  const relativePagePath = pagePath.startsWith('/')
    ? pagePath.substring(1)
    : pagePath;
  return require(path.resolve(pagesDirectory, relativePagePath));
}

export default getPages;
