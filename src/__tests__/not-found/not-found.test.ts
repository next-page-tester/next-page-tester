import { getPage } from '../../../src';
import path from 'path';
import { screen } from '@testing-library/react';
import { stripReactExtraMarkup } from '../__utils__/expectDOMElementsToMatch';

describe('not-found', () => {
  test('with fallback to default error page', async () => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__', 'default-error-page'),
      route: '/a',
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

  test.each([
    ['origGetInitialProps', '/custom-error-page'],
    ['custom getInitialProps', '/custom-error-page-gip'],
  ])('Page with %s', async (_dataFetchingType, route) => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__', route),
      route: '/a',
      useDocument: true,
    });

    render();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Custom error page')).toBeInTheDocument();
  });

  test('With custom 404 page', async () => {
    const { render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__', 'custom-404-page'),
      route: '/a',
      useDocument: true,
    });

    render();
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Go back home')).toBeInTheDocument();
  });
});
