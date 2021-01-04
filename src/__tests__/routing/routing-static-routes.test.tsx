import React from 'react';
import { render, screen } from '@testing-library/react';
import { getPage } from '../../';
import IndexPage from './__fixtures__/pages/index';
import BlogIndexPage from './__fixtures__/pages/blog/index';

const nextRoot = __dirname + '/__fixtures__';

describe('Static routes', () => {
  describe('route matching a page path', () => {
    it('gets expected component', async () => {
      const { page } = await getPage({ nextRoot, route: '/index' });
      const { container: actual } = render(page);
      const { container: expected } = render(<IndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route not matching any page', () => {
    it('throws "page not found" error', async () => {
      const { page } = await getPage({
        nextRoot,
        route: '/blog/5/doesntexists',
      });

      render(page);
      expect(
        screen.getByText('This page could not be found.')
      ).toBeInTheDocument();
    });
  });

  describe('route with trailing slash', () => {
    it('redirect to their counterpart without a trailing slash', async () => {
      const { page } = await getPage({ nextRoot, route: '/blog/' });
      const { container: actual } = render(page);
      const { container: expected } = render(<BlogIndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route === "_document"', () => {
    it('throws "page not found" error', async () => {
      const { page } = await getPage({ nextRoot, route: '/_document' });

      render(page);
      expect(
        screen.getByText('This page could not be found.')
      ).toBeInTheDocument();
    });
  });

  describe('index routes', () => {
    it('routes files named index to the root of the directory', async () => {
      const { page } = await getPage({ nextRoot, route: '/blog' });
      const { container: actual } = render(page);
      const { container: expected } = render(<BlogIndexPage />);
      expect(actual).toEqual(expected);
    });

    it('routes root pages/index page to "/"', async () => {
      const { page } = await getPage({ nextRoot, route: '/' });
      const { container: actual } = render(page);
      const { container: expected } = render(<IndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route matching /api pages', () => {
    it('throws "page not found" error', async () => {
      const { page } = await getPage({ nextRoot, route: '/api' });

      render(page);
      expect(
        screen.getByText('This page could not be found.')
      ).toBeInTheDocument();
    });
  });
});
