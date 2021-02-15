import { getPage } from '../../../src';

const nextRoot = __dirname + '/__fixtures__';

describe('require-error', () => {
  it('It should throw error with descriptive error message when failing to require _app file', async () => {
    await expect(
      getPage({
        nextRoot,
        route: '/a',
      })
    ).rejects.toThrow(
      '[next-page-tester] Failed to load "/pages/_app.tsx" file due to ReferenceError: ewqjewqj is not defined'
    );
  });
});
