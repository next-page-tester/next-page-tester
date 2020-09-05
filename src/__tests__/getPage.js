import { getPage } from '../';
import * as indexPage from './__fixtures__/pages/index';
import * as blogPage from './__fixtures__/pages/blog/[id]';
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
