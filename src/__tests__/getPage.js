import { getPage } from '../';
import * as indexPage from './__fixtures__/pages/index';
import * as blogIndexPage from './__fixtures__/pages/blog/index';
import * as blogPage from './__fixtures__/pages/blog/[id]';
import * as blogPage99 from './__fixtures__/pages/blog/99';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('getPage', () => {
  describe('route matching a page path', () => {
    it('gets expected page object', async () => {
      const actual = await getPage({ pagesDirectory, route: '/index' });
      expect(actual.page).toBe(indexPage);
      expect(actual.params).toEqual({});
    });
  });

  describe('route not matching any page', () => {
    it('returns undefined', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/5/doesntexists',
      });
      expect(actual).toBe(undefined);
    });
  });

  describe('pages files named "index"', () => {
    it('routes them to the root of the directory', async () => {
      const actual = await getPage({ pagesDirectory, route: '/blog' });
      expect(actual.page).toBe(blogIndexPage);
      expect(actual.params).toEqual({});
    });
  });

  describe('dynamic route segments', () => {
    describe('routes exactly matching a dynamic page path', () => {
      it('gets expected page object', async () => {
        const actual = await getPage({ pagesDirectory, route: '/blog/5' });
        expect(actual.page).toBe(blogPage);
        expect(actual.params).toEqual({ id: '5' });
      });

      it('predefined routes take precedence over dynamic', async () => {
        const actual = await getPage({
          pagesDirectory,
          route: '/blog/99',
        });
        expect(actual.page).toBe(blogPage99);
        expect(actual.params).toEqual({});
      });
    });
  });

  describe('route with trailing slash', () => {
    it('returns undefined', async () => {
      const actual = await getPage({ pagesDirectory, route: '/blog/5/' });
      expect(actual).toBe(undefined);
    });
  });
});
