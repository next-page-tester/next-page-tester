import { getPage } from '../../index';
import { getByText, within } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('ssr-redirect', () => {
  describe.each([['getServerSideProps', 'ssr']])(
    'Page with %s',
    (_dataFetchingType, directory) => {
      it('Correctly handles single redirect', async () => {
        const { renderHtml } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', directory),
          route: '/proxy-to-page-a',
        });

        renderHtml();
        expect(getByText(document.body, 'Page A')).toBeInTheDocument();
      });
    }
  );

  describe.each([['getServerSideProps', 'ssr']])(
    'Page with %s',
    (_dataFetchingType, directory) => {
      it('Correctly handles multiple redirects', async () => {
        const { renderHtml } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', directory),
          route: '/proxy-page?destination=/proxy-to-page-a',
        });

        renderHtml();
        expect(getByText(document.body, 'Page A')).toBeInTheDocument();
      });
    }
  );

  describe.each([['getServerSideProps', 'ssr']])(
    'Page with %s',
    (_dataFetchingType, directory) => {
      it('Correctly handles multiple redirects after client side navigation', async () => {
        const { render } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', directory),
          route: '/page-b',
        });

        render();
        const { getByText, findByText } = within(document.body);

        expect(getByText('Page B')).toBeInTheDocument();
        userEvent.click(getByText('Proxy link'));

        await findByText('Page A');
        expect(
          getByText('req.headers.referer: "http://localhost/page-b"')
        ).toBeInTheDocument();
      });
    }
  );
});
