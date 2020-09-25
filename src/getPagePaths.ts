import path from 'path';
import readdir from 'recursive-readdir';

function makeIgnoreFunc(pagesDirectory: string) {
  return (file: string) => {
    return file.startsWith(pagesDirectory + '/api/');
  };
}

async function getPagePaths({
  pagesDirectory,
}: {
  pagesDirectory: string;
}): Promise<string[]> {
  const ignoreFunc = makeIgnoreFunc(pagesDirectory);
  let files = [];
  try {
    files = await readdir(pagesDirectory, [ignoreFunc]);
  } catch (err) {
    throw new Error(`[next page tester] ${err}`);
  }

  return files.map((filePath) =>
    filePath.replace(`${path.resolve(pagesDirectory)}`, '')
  );
}

export default getPagePaths;
