import { getPage } from '../../index';
import { screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('cookies', () => {
  describe.each([
    ['getServerSideProps', 'ssr', 'initialCookie=foo; sessionId=bar'],
    ['getInitialProps', 'gip', ''],
  ])('Page with %s', (dataFetchingType, directory, expectedCookie) => {
    it('Makes document.cookie available via ctx.req.headers.cookie', async () => {
      document.cookie = 'initialCookie=foo';
      const { render } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__', directory),
        route: '/login',
      });
      render();

      // Initial cookie available at first server side render
      screen.getByText('req.headers.cookies: "initialCookie=foo"');

      userEvent.click(screen.getByText('Login'));

      await screen.findByText('Authenticated content');
      await screen.findByText(`req.headers.cookies: "${expectedCookie}"`);
      userEvent.click(screen.getByText('To login'));

      await screen.findByText('Login');
      await screen.findByText(`req.headers.cookies: "${expectedCookie}"`);
    });
  });
});
