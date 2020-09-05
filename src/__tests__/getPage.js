import { getPage } from '../';
import * as indexPage from './__fixtures__/pages/index';
import * as blogPage from './__fixtures__/pages/blog/[id]';
import * as blogPage99 from './__fixtures__/pages/blog/99';
const pagesDirectory = __dirname + '/__fixtures__/pages';

describe('getPage', () => {
  it('gets expected page', async () => {
    const actual = await getPage({ pagesDirectory, route: '/index' });
    expect(actual).toBe(indexPage);
  });

  it('gets expected page', async () => {
    const actual = await getPage({ pagesDirectory, route: '/blog/5' });
    expect(actual).toBe(blogPage);
  });

  describe('Predefined VS. dynamic routes', () => {
    it('Predefined routes take precedence over dynamic', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/99',
      });
      expect(actual).toBe(blogPage99);
    });
  });

  describe('trailing slash', () => {
    it('returns undefined', async () => {
      const actual = await getPage({ pagesDirectory, route: '/blog/5/' });
      expect(actual).toBe(undefined);
    });
  });

  describe('non macthing route', () => {
    it('returns undefined', async () => {
      const actual = await getPage({
        pagesDirectory,
        route: '/blog/5/doesntexists',
      });
      expect(actual).toBe(undefined);
    });
  });
});
