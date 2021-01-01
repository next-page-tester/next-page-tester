import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getPage } from '../../index';
import { render, screen } from '@testing-library/react';
import path from 'path';
import App from './__fixtures__/pages/_app';
import Page from './__fixtures__/pages/Page';
import { wrapWithDocument } from '../__utils__';

describe('hydration', () => {
  it('renders expected html', async () => {
    const { page, html, render } = await getPage({
      nextRoot: path.join(__dirname, '__fixtures__'),
      route: '/page',
    });

    const expectedPage = wrapWithDocument(<App Component={Page} />);
    const expectedHtml = ReactDOMServer.renderToString(expectedPage);
    expect(html).toEqual(expectedHtml);

    render();

    console.log('Hydrated DOM');
    screen.debug(document);
  });
});
