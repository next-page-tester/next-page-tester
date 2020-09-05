import { getPage } from '../';
import * as indexPage from './__fixtures__/pages/index';
import * as blogPage from './__fixtures__/pages/blog/[id]';
import * as blogPage99 from './__fixtures__/pages/blog/99';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('getPage', () => {
  it('gets expected page object', async () => {
    const actual = await getPage({ pagesDirectory, route: '/index' });
    expect(actual.page).toBe(indexPage);
  });

  it('gets expected page object', async () => {
    const actual = await getPage({ pagesDirectory, route: '/blog/5' });
    expect(actual.page).toBe(blogPage);
  });

  describe('Predefined VS. dynamic routes', () => {
    it('predefined routes take precedence over dynamic', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/99',
      });
      expect(actual.page).toBe(blogPage99);
    });
  });

  describe('trailing slash', () => {
    it('returns undefined', async () => {
      const actual = await getPage({ pagesDirectory, route: '/blog/5/' });
      expect(actual).toBe(undefined);
    });
  });

  describe('non matching route', () => {
    it('returns undefined', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/5/doesntexists',
      });
      expect(actual).toBe(undefined);
    });
  });
});
