import path from 'path';
import 'setimmediate';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';

describe('tiny-glob', () => {
  it('finds expected filed', async () => {
    const pagesDirectory = path.join(__dirname, '__fixtures__');
    const files = await fastGlob([
      normalizePath(path.join(pagesDirectory, '**', '*')),
    ]);

    const expected = [
      path.join(pagesDirectory, 'a.js'),
      path.join(pagesDirectory, 'b.ts'),
      path.join(pagesDirectory, 'c.tsx'),
    ];
    expect(files).toEqual(expected);
  });
});
