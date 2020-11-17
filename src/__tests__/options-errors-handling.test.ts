import { getPage } from '../index';
const nextRoot = __dirname + '/__fixtures__';

describe('Options errors handling', () => {
  describe('route doesn\'t start with "/"', () => {
    it('throws error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: 'blog',
        })
      ).rejects.toThrow('[next page tester] "route" option should start');
    });
  });

  describe('provided "nextRoot" doesn\'t exist', () => {
    it('throws error', async () => {
      await expect(
        getPage({
          nextRoot: 'doesnt-exist',
          route: '/page',
        })
      ).rejects.toThrow('[next page tester] Cannot find "nextRoot" directory');
    });
  });
});
