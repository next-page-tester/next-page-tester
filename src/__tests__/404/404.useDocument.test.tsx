import { getPage } from '../..';
import path from 'path';
import { screen } from '@testing-library/react';
import { stripReactExtraMarkup } from '../__utils__';

describe('404', () => {
  describe.each([
    ['ssr "notFound" return', '/a'],
    ['matching page not found', '/random?a=b'],
  ])('%s', (_title, route) => {
    describe('no custom 404 or custom _error page provided', () => {
      it('renders nextjs default error page', async () => {
        const { render } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', 'default-error-page'),
          route,
          useDocument: true,
        });
        render();
        expect(stripReactExtraMarkup(document.title)).toEqual(
          '404: This page could not be found'
        );
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(
          screen.getByText('This page could not be found.')
        ).toBeInTheDocument();
      });
    });
  });
});
