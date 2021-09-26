import { getPage } from '../..';
const nextRoot = __dirname + '/__fixtures__';

describe('Options errors handling', () => {
  describe('route doesn\'t start with "/"', () => {
    it('throws error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: 'index',
        })
      ).rejects.toThrow(
        '[next-page-tester] "route" option should start with "/"'
      );
    });
  });

  describe('provided "nextRoot" doesn\'t exist', () => {
    it('throws error', async () => {
      await expect(
        getPage({
          nextRoot: 'doesnt-exist',
          route: '/index',
        })
      ).rejects.toThrow('[next-page-tester] Cannot find "nextRoot" directory');
    });
  });

  describe('"useDocument" option is true', () => {
    it('throws error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: '/index',
          useDocument: true,
        })
      ).rejects.toThrow(
        '[next-page-tester] useDocument option was temporarily disabled since v0.29.0 due to issue #263'
      );
    });
  });
});
