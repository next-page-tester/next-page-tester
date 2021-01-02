import { getPage } from '../../index';
import { within } from '@testing-library/react';
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

      const { getByText, findByText } = within(document.body);
      // Initial cookie available at first server side render
      getByText('req.headers.cookies: "initialCookie=foo"');

      userEvent.click(getByText('Login'));

      await findByText('Authenticated content');
      await findByText(`req.headers.cookies: "${expectedCookie}"`);
      userEvent.click(getByText('To login'));

      await findByText('Login');
      await findByText(`req.headers.cookies: "${expectedCookie}"`);
    });
  });
});
