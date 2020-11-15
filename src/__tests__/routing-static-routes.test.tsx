import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getPage } from '../index';
import IndexPage from './__fixtures__/pages/index';
import TypescriptPage from './__fixtures__/pages/typescript';
import BlogIndexPage from './__fixtures__/pages/blog/index';
const nextRoot = __dirname + '/__fixtures__';

describe('Static routes', () => {
  describe('route matching a page path', () => {
    it('gets expected component', async () => {
      const actualPage = await getPage({ nextRoot, route: '/index' });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<IndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route not matching any page', () => {
    it('throws "page not found" error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: '/blog/5/doesntexists',
        })
      ).rejects.toThrow('[next page tester]');
    });
  });

  describe('route with trailing slash', () => {
    it('throws "page not found" error', async () => {
      await expect(getPage({ nextRoot, route: '/blog/5/' })).rejects.toThrow(
        '[next page tester]'
      );
    });
  });

  describe('route === "_document"', () => {
    it('throws "page not found" error', async () => {
      await expect(getPage({ nextRoot, route: '/_document' })).rejects.toThrow(
        '[next page tester]'
      );
    });
  });

  describe('route matching page with valid non ".js" extension', () => {
    it('renders page', async () => {
      const actualPage = await getPage({
        nextRoot,
        route: '/typescript',
      });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<TypescriptPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route matching page file with invalid extension', () => {
    it('throws "page not found" error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: '/invalid-extension',
        })
      ).rejects.toThrow('[next page tester]');
    });
  });

  describe('Index routes', () => {
    it('route files named index to the root of the directory', async () => {
      const actualPage = await getPage({ nextRoot, route: '/blog' });
      const { container: actual } = render(actualPage);
      const { container: expected } = render(<BlogIndexPage />);
      expect(actual).toEqual(expected);
    });
  });

  describe('route matching /api pages', () => {
    it('throws "page not found" error', async () => {
      await expect(
        getPage({
          nextRoot,
          route: '/api',
        })
      ).rejects.toThrow('[next page tester]');
    });
  });
});
