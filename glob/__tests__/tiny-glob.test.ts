import path from 'path';
import tinyGlob from 'tiny-glob';
import normalizePath from 'normalize-path';
import { existsSync } from 'fs';

describe('tiny-glob', () => {
  it('finds expected filed', async () => {
    const pagesDirectory = path.join(__dirname, '__fixtures__');
    const files = await tinyGlob(
      normalizePath(path.join(pagesDirectory, '**', '*')),
      { absolute: true }
    );

    const expected = [
      path.join(pagesDirectory, 'a.js'),
      path.join(pagesDirectory, 'b.ts'),
      path.join(pagesDirectory, 'c.tsx'),
    ];
    expect(files).toEqual(expected);

    expected.forEach((file) => {
      expect(existsSync(file)).toBe(true);
    });
  });
});
