import { getPage } from '../../index';
import { within } from '@testing-library/react';
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
        const { getByText, findByText } = within(document.body);

        getByText('req.headers.referer: ""');

        userEvent.click(getByText('To /page-b'));

        await findByText('req.headers.referer: "http://localhost/page-a"');

        userEvent.click(getByText('To /page-c'));

        await findByText('req.headers.referer: "http://localhost/page-b"');

        userEvent.click(getByText('To /page-a'));

        await findByText('req.headers.referer: "http://localhost/page-c"');
      });
    }
  );
});
