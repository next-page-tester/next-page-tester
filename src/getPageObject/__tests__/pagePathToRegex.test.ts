/**
 * @jest-environment node
 */
import {
  pagePathToRouteRegex,
  ROUTE_PARAMS_TYPES,
} from '../parseMatchingRoute/utils';

describe('pagePathToRouteRegex', () => {
  describe('predefined routes', () => {
    it('gets expected regex', () => {
      const { regex, paramTypes } = pagePathToRouteRegex('/index');
      const expectedRegex = new RegExp('^/(?:index)?$').toString();
      const expectedParamTypes = {};

      expect(regex.toString()).toBe(expectedRegex);
      expect(paramTypes).toEqual(expectedParamTypes);
    });
  });

  describe('dynamic segments', () => {
    it('gets expected regex', () => {
      const { regex, paramTypes } = pagePathToRouteRegex(
        '/blog/[id]/[foo]/index'
      );
      const expectedRegex = new RegExp(
        `^/blog/(?<id>[^/?]*)/(?<foo>[^/?]*)(?:/index)?$`
      ).toString();
      const expectedParamTypes = {
        id: ROUTE_PARAMS_TYPES.DYNAMIC,
        foo: ROUTE_PARAMS_TYPES.DYNAMIC,
      };

      expect(regex.toString()).toBe(expectedRegex);
      expect(paramTypes).toEqual(expectedParamTypes);
    });
  });

  describe('catch all segments', () => {
    it('gets expected regex', () => {
      const { regex, paramTypes } = pagePathToRouteRegex(
        '/blog/[id]/[...foo]/index'
      );
      const expectedRegex = new RegExp(
        `^/blog/(?<id>[^/?]*)/(?<foo>.*?)(?:/index)?$`
      ).toString();
      const expectedParamTypes = {
        id: ROUTE_PARAMS_TYPES.DYNAMIC,
        foo: ROUTE_PARAMS_TYPES.CATCH_ALL,
      };

      expect(regex.toString()).toBe(expectedRegex);
      expect(paramTypes).toEqual(expectedParamTypes);
    });
  });

  describe('optional catch all segments', () => {
    it('gets expected regex', () => {
      const { regex, paramTypes } = pagePathToRouteRegex(
        '/blog/[id]/[[...foo]]/index'
      );
      const expectedRegex = new RegExp(
        `^/blog/(?<id>[^/?]*)(?:/)?(?<foo>.*?)?(?:/index)?$`
      ).toString();
      const expectedParamTypes = {
        id: ROUTE_PARAMS_TYPES.DYNAMIC,
        foo: ROUTE_PARAMS_TYPES.OPTIONAL_CATCH_ALL,
      };

      expect(regex.toString()).toBe(expectedRegex);
      expect(paramTypes).toEqual(expectedParamTypes);
    });
  });
});
