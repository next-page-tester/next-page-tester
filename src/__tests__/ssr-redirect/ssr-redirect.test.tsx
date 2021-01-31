import { getPage } from '../../../src';
import { screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('ssr-redirect', () => {
  describe.each([['getServerSideProps', 'ssr']])(
    'Page with %s',
    (_dataFetchingType, directory) => {
      const nextRoot = path.join(__dirname, '__fixtures__', directory);

      it('Throws an error on external redirect', async () => {
        const redirect = 'https://www.example.com';
        await expect(
          getPage({
            nextRoot,
            route: `/proxy-page?destination=${redirect}`,
          })
        ).rejects.toThrow(`[next-page-tester] External route: ${redirect}`);
      });

      it('Correctly handles single redirect', async () => {
        const { serverRender } = await getPage({
          nextRoot,
          route: '/proxy-to-page-a',
        });

        serverRender();
        expect(screen.getByText('Page A')).toBeInTheDocument();
      });

      it('Correctly handles multiple redirects', async () => {
        const { serverRender } = await getPage({
          nextRoot,
          route: '/proxy-page?destination=/proxy-to-page-a',
        });

        serverRender();
        expect(screen.getByText('Page A')).toBeInTheDocument();
      });

      it('Correctly handles multiple redirects after client side navigation', async () => {
        const { render } = await getPage({
          nextRoot,
          route: '/page-b',
        });

        render();

        expect(screen.getByText('Page B')).toBeInTheDocument();
        userEvent.click(screen.getByText('Proxy link'));

        await screen.findByText('Page A');
        expect(
          screen.getByText('req.headers.referer: "http://localhost/page-b"')
        ).toBeInTheDocument();
      });
    }
  );
});
