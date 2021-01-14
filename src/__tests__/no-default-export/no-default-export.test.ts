import path from 'path';
import { getPage } from '../../../src';

describe('no-default-export', () => {
  test('Should throw error if page has no default export', async () => {
    await expect(
      getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/a',
      })
    ).rejects.toThrow(
      '[next-page-tester] No default export found for given route'
    );
  });
});
