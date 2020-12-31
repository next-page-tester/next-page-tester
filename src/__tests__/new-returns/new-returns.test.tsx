import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { render as TLRender } from '@testing-library/react';
import { getPage } from '../../index';
import path from 'path';
import App from './__fixtures__/pages/_app';
import Page from './__fixtures__/pages/page';
import { wrapWithNextRoot } from '../__utils__';
import { expectDOMElementsToMatch } from '../__utils__';

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

  describe('renderHTML', () => {
    it('append to DOM expected elements', async () => {
      const { renderHTML } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/page',
      });
      renderHTML();

      const actualHtml = document.documentElement;
      const { container: expectedHtml } = TLRender(
        <>
          <head />
          <body>
            <div id="__next">
              <App Component={Page} />
            </div>
          </body>
        </>,
        {
          container: document.createElement('html'),
        }
      );

      expectDOMElementsToMatch(actualHtml, expectedHtml);
    });
  });

  describe('render', () => {
    it('hydrate in DOM expected element', async () => {
      const { render } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/page',
      });
      render();

      const actualHtml = document.documentElement;
      const { container: expectedHtml } = TLRender(
        <>
          <head />
          <body>
            <div id="__next">
              <App Component={Page} />
            </div>
          </body>
        </>,
        {
          container: document.createElement('html'),
        }
      );

      expectDOMElementsToMatch(actualHtml, expectedHtml);
    });
  });
});
