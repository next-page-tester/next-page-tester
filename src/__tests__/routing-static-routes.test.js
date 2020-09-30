import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPage } from '../index';
import IndexPage from './__fixtures__/pages/index';
import TypescriptPage from './__fixtures__/pages/typescript.ts';
import BlogIndexPage from './__fixtures__/pages/blog/index';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('Static routes', () => {
  describe('route matching a page path', () => {
    it('gets expected component', async () => {
      const actualPage = await getPage({ pagesDirectory, route: '/index' });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<IndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route not matching any page', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/blog/5/doesntexists',
      });
      expect(actualPage).toBe(undefined);
    });
  });

  describe('route with trailing slash', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({ pagesDirectory, route: '/blog/5/' });
      expect(actualPage).toBe(undefined);
    });
  });

  describe('route === "_document"', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({ pagesDirectory, route: '/_document' });
      expect(actualPage).toBe(undefined);
    });
  });

  describe('route matching page with .ts extension', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/typescript',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<TypescriptPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route matching page file with invalid extension', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/invalid-extension',
      });
      expect(actualPage).toBe(undefined);
    });
  });

  describe('Index routes', () => {
    it('route files named index to the root of the directory', async () => {
      const actualPage = await getPage({ pagesDirectory, route: '/blog' });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<BlogIndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route matching /api pages', () => {
    it('returns undefined', async () => {
      const actualPage = await getPage({
        pagesDirectory,
        route: '/api',
      });
      expect(actualPage).toBe(undefined);
    });
  });
});
