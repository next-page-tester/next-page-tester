/**
 * @jest-environment node
 */
import {
  extractPagePathParamTypes,
  ROUTE_PARAMS_TYPES,
} from '../parseMatchingRoute/utils';

describe('extractPagePathParamTypes', () => {
  describe('predefined routes', () => {
    it('gets expected regex', () => {
      const actual = extractPagePathParamTypes({ pagePath: '/index' });
      const expected = {};
      expect(actual).toEqual(expected);
    });
  });

  describe('dynamic segments', () => {
    it('gets expected regex', () => {
      const actual = extractPagePathParamTypes({
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
      const actual = extractPagePathParamTypes({
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
      const actual = extractPagePathParamTypes({
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
