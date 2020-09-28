import path from 'path';
import readdir from 'recursive-readdir';

// Returns available page paths without file extension
async function getPagePaths({
  pagesDirectory,
}: {
  pagesDirectory: string;
}): Promise<string[]> {
  let files = [];
  try {
    files = await readdir(pagesDirectory);
  } catch (err) {
    throw new Error(`[next page tester] ${err}`);
  }

  const pagesDirectoryAbs = path.resolve(pagesDirectory);
  // @TODO Make allowed extensions configurable
  const extensionsRegex = /\.(?:mdx|jsx|js|ts|tsx)$/;
  return files
    .map((filePath) => filePath.replace(pagesDirectoryAbs, ''))
    .filter((filePath) => {
      if (filePath.startsWith('/api/')) {
        return false;
      }
      return true;
    })
    .map((filePath) => filePath.replace(extensionsRegex, ''));
}

export default getPagePaths;
