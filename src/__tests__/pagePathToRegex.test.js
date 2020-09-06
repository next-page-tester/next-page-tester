import {
  default as pagePathToRouteRegex,
  PARAM_WILDCARD_REGEX_STRING as WILDCARD,
} from '../pagePathToRouteRegex';

describe('pagePathToRouteRegex', () => {
  it('gets expected regex', () => {
    const actual = pagePathToRouteRegex('/index.js');
    const expected = new RegExp('^(?:/index)?$').toString();
    expect(actual.toString()).toBe(expected);
  });

  it('gets expected regex with dynamic segments', () => {
    const actual = pagePathToRouteRegex('/blog/[id]/[foo]/index.js');
    const expected = new RegExp(
      `^/blog/(?<id>${WILDCARD})/(?<foo>${WILDCARD})(?:/index)?$`
    ).toString();

    expect(actual.toString()).toBe(expected);
  });
});
