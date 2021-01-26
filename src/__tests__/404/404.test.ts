import { getPage } from '../../../src';
import path from 'path';
import { screen } from '@testing-library/react';
import { stripReactExtraMarkup } from '../__utils__/expectDOMElementsToMatch';

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

    describe('no custom 404 page but with custom _error page provided', () => {
      it.each([
        ['origGetInitialProps', '/custom-error-page'],
        ['custom getInitialProps', '/custom-error-page-gip'],
      ])(
        'renders custom _error page with %s',
        async (_dataFetchingType, directory) => {
          const { render } = await getPage({
            nextRoot: path.join(__dirname, '__fixtures__', directory),
            route,
          });

          render();
          expect(screen.getByText('404')).toBeInTheDocument();
          expect(screen.getByText('Custom error page')).toBeInTheDocument();
        }
      );
    });

    describe('with custom 404 page and custom _error page', () => {
      it('renders custom 404 page', async () => {
        const { render } = await getPage({
          nextRoot: path.join(__dirname, '__fixtures__', 'custom-404-page'),
          route,
        });

        render();
        expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
        expect(screen.getByText('Go back home')).toBeInTheDocument();
      });
    });
  });
});
