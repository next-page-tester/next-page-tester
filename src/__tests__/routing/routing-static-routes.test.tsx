import React from 'react';
import { getPage } from '../../';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import IndexPage from './__fixtures__/pages/index';
import BlogIndexPage from './__fixtures__/pages/blog/index';

const nextRoot = __dirname + '/__fixtures__';

describe('Static routes', () => {
  describe('route matching a page path', () => {
    it('gets expected component', async () => {
      const { render } = await getPage({ nextRoot, route: '/index' });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(<IndexPage />);
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('route not matching any page', () => {
    it('throws "page not found" error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: '/blog/5/doesntexists',
        })
      ).rejects.toThrow(
        '[next-page-tester] No matching page found for given route'
      );
    });
  });

  describe('route with trailing slash', () => {
    it('redirect to their counterpart without a trailing slash', async () => {
      const { render } = await getPage({ nextRoot, route: '/blog/' });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(<BlogIndexPage />);
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('route === "_document"', () => {
    it('throws "page not found" error', async () => {
      await expect(getPage({ nextRoot, route: '/_document' })).rejects.toThrow(
        '[next-page-tester] No matching page found for given route'
      );
    });
  });

  describe('index routes', () => {
    it('routes files named index to the root of the directory', async () => {
      const { render } = await getPage({ nextRoot, route: '/blog' });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(<BlogIndexPage />);
      expectDOMElementsToMatch(actual, expected);
    });

    it('routes root pages/index page to "/"', async () => {
      const { render } = await getPage({ nextRoot, route: '/' });
      const { nextRoot: actual } = render();
      const { container: expected } = renderWithinNextRoot(<IndexPage />);
      expectDOMElementsToMatch(actual, expected);
    });
  });

  describe('route matching /api pages', () => {
    it('throws "page not found" error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: '/api',
        })
      ).rejects.toThrow(
        '[next-page-tester] No matching page found for given route'
      );
    });
  });
});
