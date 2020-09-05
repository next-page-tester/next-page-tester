import {
  default as pagePathToRouteRegex,
  ANYTHING_BUT_SLASH_REGEX_STRING as ANYTHING_BUT_SLASH_REGEX,
} from '../pagePathToRouteRegex';

describe('pagePathToRouteRegex', () => {
  it('gets expected regex', () => {
    const actual = pagePathToRouteRegex('/index.js');
    const expected = new RegExp('^/index$').toString();
    expect(actual.toString()).toBe(expected);
  });

  it('gets expected regex with dynamic segments', () => {
    const actual = pagePathToRouteRegex('/blog/[id]/[fof]/index.js');
    const expected = new RegExp(
      `^/blog/${ANYTHING_BUT_SLASH_REGEX}/${ANYTHING_BUT_SLASH_REGEX}/index$`
    ).toString();

    expect(actual.toString()).toBe(expected);
  });
});
