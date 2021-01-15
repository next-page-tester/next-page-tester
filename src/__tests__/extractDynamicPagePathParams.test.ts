import {
  extractDynamicPagePathParams,
  ROUTE_PARAMS_TYPES,
} from '../pagePathParser';

describe('extractDynamicPagePathParams', () => {
  describe('predefined routes', () => {
    it('gets expected regex', () => {
      const actual = extractDynamicPagePathParams({ pagePath: '/index' });
      const expected = {};
      expect(actual).toEqual(expected);
    });
  });

  describe('dynamic segments', () => {
    it('gets expected regex', () => {
      const actual = extractDynamicPagePathParams({
        pagePath: '/blog/[id]/[foo]/index',
      });
      const expected = {
        id: ROUTE_PARAMS_TYPES.DYNAMIC,
        foo: ROUTE_PARAMS_TYPES.DYNAMIC,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('catch all segments', () => {
    it('gets expected regex', () => {
      const actual = extractDynamicPagePathParams({
        pagePath: '/blog/[id]/[...foo]/index',
      });
      const expected = {
        id: ROUTE_PARAMS_TYPES.DYNAMIC,
        foo: ROUTE_PARAMS_TYPES.CATCH_ALL,
      };
      expect(actual).toEqual(expected);
    });
  });

  describe('optional catch all segments', () => {
    it('gets expected regex', () => {
      const actual = extractDynamicPagePathParams({
        pagePath: '/blog/[id]/[[...foo]]/index',
      });
      const expected = {
        id: ROUTE_PARAMS_TYPES.DYNAMIC,
        foo: ROUTE_PARAMS_TYPES.OPTIONAL_CATCH_ALL,
      };
      expect(actual).toEqual(expected);
    });
  });
});
