import { getPage } from '../../../src';

const nextRoot = __dirname + '/__fixtures__';

describe('require-error', () => {
  describe('page require', () => {
    describe('reference error', () => {
      it('It throws error with descriptive error message', async () => {
        await expect(
          getPage({
            nextRoot,
            route: '/reference-error',
          })
        ).rejects.toThrow(
          '[next-page-tester] Failed to load "reference-error.tsx" file due to ReferenceError: ewqjewqj is not defined'
        );
      });
    });

    describe('import file with unknown extension', () => {
      it('It throws error with descriptive error message', async () => {
        await expect(
          getPage({
            nextRoot,
            route: '/unknown-imported-extension',
          })
        ).rejects.toThrow(
          '[next-page-tester] Failed to load "unknown-imported-extension.tsx" file due to: Unexpected identifier'
        );
      });
    });
  });
});
