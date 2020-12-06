import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('cookies', () => {
  describe.each([
    ['getServerSideProps', 'ssr'],
    ['getInitialProps', 'gip'],
  ])('Page with %s', (dataFetchingType, directory) => {
    it('Makes document.cookie available via ctx.req.headers.cookie', async () => {
      const { page } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__', directory),
        route: '/login',
      });
      render(page);
      screen.getByText('req.headers.cookies: ""');

      userEvent.click(screen.getByText('Login'));

      await screen.findByText('Authenticated content');
      await screen.findByText('req.headers.cookies: "SessionId=super-secret"');
      userEvent.click(screen.getByText('To login'));

      await screen.findByText('Login');
      await screen.findByText('req.headers.cookies: "SessionId=super-secret"');
    });
  });
});
