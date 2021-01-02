import path from 'path';
import { getByText } from '@testing-library/react';
import { getPage } from '../../index';

describe('Pages directory discovery + "nextRoot" option', () => {
  it('discover "pages" directory in auto-detected root', async () => {
    const { renderHtml } = await getPage({
      route: '/page',
    });

    renderHtml();
    getByText(document.body, 'Page in natural root');
  });

  describe('With "nextRoot" option', () => {
    it('discover "pages" directory in provided root', async () => {
      const nextRoot = path.join(__dirname, '/in-root');
      const { renderHtml } = await getPage({
        route: '/page',
        nextRoot,
      });

      renderHtml();
      getByText(document.body, 'Page in root');
    });

    it('discover "pages" directory in root/src', async () => {
      const nextRoot = path.join(__dirname, '/in-src');
      const { renderHtml } = await getPage({
        route: '/page',
        nextRoot,
      });

      renderHtml();
      getByText(document.body, 'Page in src');
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
