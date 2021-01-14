import { getPage } from '../../../src';
import { screen } from '@testing-library/react';
import path from 'path';
import userEvent from '@testing-library/user-event';

describe('referer', () => {
  describe.each([['getServerSideProps', 'ssr']])(
    'Page with %s',
    (_dataFetchingType, directory) => {
      it('Makes referer available via ctx.req.headers.referer', async () => {
        const { render } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', directory),
          route: '/page-a',
        });
        render();
        screen.getByText('req.headers.referer: ""');

        userEvent.click(screen.getByText('To /page-b'));
        await screen.findByText(
          'req.headers.referer: "http://localhost/page-a"'
        );

        userEvent.click(screen.getByText('To /page-c'));
        await screen.findByText(
          'req.headers.referer: "http://localhost/page-b"'
        );

        userEvent.click(screen.getByText('To /page-a'));
        await screen.findByText(
          'req.headers.referer: "http://localhost/page-c"'
        );
      });
    }
  );
});
