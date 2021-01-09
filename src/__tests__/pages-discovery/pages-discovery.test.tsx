import path from 'path';
import { screen } from '@testing-library/react';
import { getPage } from '../../index';

describe('Pages directory discovery + "nextRoot" option', () => {
  it('discover "pages" directory in auto-detected root', async () => {
    const { serverRender } = await getPage({
      route: '/page',
    });

    serverRender();
    screen.getByText('Page in natural root');
  });

  describe('With "nextRoot" option', () => {
    it('discover "pages" directory in provided root', async () => {
      const nextRoot = path.join(__dirname, '/in-root');
      const { serverRender } = await getPage({
        route: '/page',
        nextRoot,
      });

      serverRender();
      screen.getByText('Page in root');
    });

    it('discover "pages" directory in root/src', async () => {
      const nextRoot = path.join(__dirname, '/in-src');
      const { serverRender } = await getPage({
        route: '/page',
        nextRoot,
      });

      serverRender();
      screen.getByText('Page in src');
    });

    describe('"pages" directory not found', () => {
      it('throws error', async () => {
        await expect(
          getPage({
            nextRoot: __dirname,
            route: '/page',
          })
        ).rejects.toThrow('[next page tester] Cannot find "pages" directory');
      });
    });
  });
});
