import fastGlob from 'fast-glob';

// Returns available page paths without file extension
async function getPagePaths({
  pagesDirectory,
}: {
  pagesDirectory: string;
}): Promise<string[]> {
  const files = await fastGlob([pagesDirectory + '/**/*']);
  // @TODO Make allowed extensions configurable
  const extensionsRegex = /\.(?:mdx|jsx|js|ts|tsx)$/;
  return (
    files
      // Make page paths relative
      .map((filePath) => filePath.replace(pagesDirectory, ''))
      // Filter out files with non-allowed extensions
      .filter((filePath) => filePath.match(extensionsRegex))
      // Strip file extensions
      .map((filePath) => filePath.replace(extensionsRegex, ''))
      // Filter out /api folder
      .filter((filePath) => !filePath.startsWith('/api/'))
      // Filter out /_app and /_document files
      .filter((filePath) => filePath !== '/_app' && filePath !== '/_document')
  );
}

export default getPagePaths;
