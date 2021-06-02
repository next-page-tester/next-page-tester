import path from 'path';
import 'setimmediate';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { existsSync } from 'fs';

describe('tiny-glob', () => {
  it('finds expected filed', async () => {
    const pagesDirectory = path.join(__dirname, '__fixtures__');
    const files = await fastGlob([
      normalizePath(path.join(pagesDirectory, '**', '*')),
    ]);

    const normFiles = files.map((file) => normalizePath(file));

    const expected = [
      normalizePath(path.join(pagesDirectory, 'a.js')),
      normalizePath(path.join(pagesDirectory, 'b.ts')),
      normalizePath(path.join(pagesDirectory, 'c.tsx')),
    ];
    expect(normFiles).toEqual(expected);

    normFiles.forEach((file) => {
      expect(existsSync(file)).toBe(true);
    });
  });
});
