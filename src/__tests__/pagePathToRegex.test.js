import pagePathToRouteRegex from '../pagePathToRouteRegex';

describe('pagePathToRouteRegex', () => {
  describe('predefined routes', () => {
    it('gets expected regex', () => {
      const actual = pagePathToRouteRegex('/index.js');
      const expected = new RegExp('^(?:/index)?$').toString();
      expect(actual.toString()).toBe(expected);
    });
  });

  describe('dynamic segments', () => {
    it('gets expected regex', () => {
      const actual = pagePathToRouteRegex('/blog/[id]/[foo]/index.js');
      const expected = new RegExp(
        `^/blog/(?<id>[^/?]*)/(?<foo>[^/?]*)(?:/index)?$`
      ).toString();

      expect(actual.toString()).toBe(expected);
    });
  });

  describe('catch all segments', () => {
    it('gets expected regex', () => {
      const actual = pagePathToRouteRegex('/blog/[id]/[...foo]/index.js');
      const expected = new RegExp(
        `^/blog/(?<id>[^/?]*)/(?<foo>.*?)(?:/index)?$`
      ).toString();

      expect(actual.toString()).toBe(expected);
    });
  });
});
