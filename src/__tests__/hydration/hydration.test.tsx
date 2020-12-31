import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';
import path from 'path';
import App from './__fixtures__/pages/_app';
import Page from './__fixtures__/pages/Page';

function wrapWithNextRoot(element: JSX.Element): JSX.Element {
  return (
    <html>
      <head></head>
      <body>
        <div id="__next">{element}</div>
      </body>
    </html>
  );
}

describe('hydration', () => {
  it('renders expected html', async () => {
    const { page, html } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/page',
    });

    const expectedPage = wrapWithNextRoot(<App Component={Page} />);
    const expectedHtml = ReactDOMServer.renderToStaticMarkup(expectedPage);
    expect(html).toEqual(expectedHtml);

    // 1- Replace the whole document content with returned html :)
    // @NOTE: This might be executed directly by getPage
    document.documentElement.innerHTML = html;
    console.log('SSR rendered DOM');
    screen.debug(document);

    const nextRootElement = document.getElementById('__next');
    if (!nextRootElement) {
      throw new Error('[next-page-tester] Missing __next div');
    }

    // 2- Hydrate page element in existing DOM
    render(page, {
      hydrate: true,
      container: nextRootElement,
    });

    console.log('Hydrated DOM');
    screen.debug(document);
  });
});
