import { getPage } from '../index';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('Options errors handling', () => {
  describe("pagesDirectory doesn't exist", () => {
    it('throws error', async () => {
      await expect(
        getPage({
          pagesDirectory: 'doesnt-exist',
          route: '/blog',
        })
      ).rejects.toThrow('[next page tester]');
    });
  });

  describe('route doesn\'t start with "/"', () => {
    it('throws error', async () => {
      await expect(
        getPage({
          pagesDirectory,
          route: 'blog',
        })
      ).rejects.toThrow('[next page tester]');
    });
  });
});
