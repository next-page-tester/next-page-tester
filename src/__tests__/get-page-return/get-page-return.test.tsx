import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { render as TLRender } from '@testing-library/react';
import { getPage } from '../../../src';
import path from 'path';
import App from './__fixtures__/pages/_app';
import Page from './__fixtures__/pages/page';
import { expectDOMElementsToMatch } from '../__utils__';

// @NOTE These tests are not extensive.
// They provide a rough idea of the values returned by getPage
describe('getPage() return', () => {
  describe('serverRenderToString', () => {
    it("returns HTML string representing the apps's SSR output", async () => {
      const { serverRenderToString } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/page',
      });
      const { html } = serverRenderToString();

      const expectedPage = (
        <html>
          <head />
          <body>
            <div id="__next">
              <App Component={Page} />
            </div>
          </body>
        </html>
      );
      const expectedHtml = ReactDOMServer.renderToString(expectedPage);
      expect(html).toEqual(expectedHtml);
    });
  });

  describe('serverRender', () => {
    it('append to DOM expected elements', async () => {
      const { serverRender } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/page',
      });
      const { nextRoot } = serverRender();
      // eslint-disable-next-line testing-library/no-node-access
      const actualNextRoot = document.getElementById('__next');
      expect(nextRoot).toBe(actualNextRoot);

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

    it('preserves existing body element', async () => {
      const initialBody = document.body;
      const { serverRender } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/page',
      });
      serverRender();
      expect(initialBody).toBe(document.body);
    });
  });

  describe('render', () => {
    it('hydrate in DOM expected element', async () => {
      const { render } = await getPage({
        nextRoot: path.join(__dirname, '__fixtures__'),
        route: '/page',
      });
      const { nextRoot } = render();
      // eslint-disable-next-line testing-library/no-node-access
      const actualNextRoot = document.getElementById('__next');
      expect(nextRoot).toBe(actualNextRoot);

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
