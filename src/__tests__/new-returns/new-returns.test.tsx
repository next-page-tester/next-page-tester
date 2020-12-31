import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getPage } from '../../index';
import path from 'path';
import App from './__fixtures__/pages/_app';
import Page from './__fixtures__/pages/page';
import { wrapWithNextRoot } from '../__utils__';

describe('New returns', () => {
  describe('html', () => {
    it('renders expected string', async () => {
      const { html } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/page',
      });

      const expectedPage = wrapWithNextRoot(<App Component={Page} />);
      const expectedHtml = ReactDOMServer.renderToString(expectedPage);
      expect(html).toEqual(expectedHtml);
    });
  });
});
