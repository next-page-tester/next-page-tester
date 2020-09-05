import path from 'path';
import readdir from 'recursive-readdir';

async function getPagePaths({ pagesDirectory }) {
  let files = [];
  try {
    files = await readdir(pagesDirectory);
  } catch (err) {
    throw new Error(`[next testing] ${err}`);
  }

  return files.map((filePath) =>
    filePath.replace(`${path.resolve(pagesDirectory)}`, '')
  );
}

export default getPagePaths;
