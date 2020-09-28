import path from 'path';
import readdir from 'recursive-readdir';

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
  return files
    .map((filePath) => filePath.replace(pagesDirectoryAbs, ''))
    .filter((filename) => {
      if (filename.startsWith('/api/')) {
        return false;
      }
      return true;
    });
}

export default getPagePaths;
