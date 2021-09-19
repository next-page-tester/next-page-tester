import React from 'react';
import { getPage } from '../../../src';
import { expectDOMElementsToMatch, renderWithinNextRoot } from '../__utils__';
import IndexPage from './__fixtures__/pages/index';
import BlogIndexPage from './__fixtures__/pages/blog/index';
import { expectToBeDefault404Page } from '../__utils__';
import { DOCUMENT_PATH } from '../../constants';

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
    it('renders 404 page', async () => {
      const { serverRender } = await getPage({
        nextRoot,
        route: '/blog/5/doesntexists',
      });
      const { nextRoot: actual } = serverRender();
      expectToBeDefault404Page(actual);
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
    it('renders 404 page', async () => {
      const { serverRender } = await getPage({
        nextRoot,
        route: DOCUMENT_PATH,
      });
      const { nextRoot: actual } = serverRender();
      expectToBeDefault404Page(actual);
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
    it('renders 404 page', async () => {
      const { serverRender } = await getPage({
        nextRoot,
        route: '/api',
      });
      const { nextRoot: actual } = serverRender();
      expectToBeDefault404Page(actual);
    });
  });
});
