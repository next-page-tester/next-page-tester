import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';
import path from 'path';

describe('ssr-not-found', () => {
  describe.each([['getServerSideProps', 'ssr']])(
    'Page with %s',
    (_dataFetchingType, directory) => {
      it('Correctly handles SSR "notFound"', async () => {
        const { page } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', directory),
          route: '/a',
        });

        render(page);
        expect(
          screen.getByText('This page could not be found.')
        ).toBeInTheDocument();
        expect(screen.getByText('404')).toBeInTheDocument();
      });
    }
  );
});
