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
  return (
    files
      // Make page paths relative
      .map((filePath) => filePath.replace(pagesDirectoryAbs, ''))
      // Strip file extensions
      .map((filePath) => filePath.replace(extensionsRegex, ''))
      // Filter out /api folder
      .filter((filePath) => !filePath.startsWith('/api/'))
      // Filter out /_app and /_document files
      .filter((filePath) => filePath !== '/_app' && filePath !== '/_document')
  );
}

export default getPagePaths;
