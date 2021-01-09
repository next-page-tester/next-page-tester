const REACT_NEW_LINE_COMMENTS_REGEX = /<!-- -->/g;
const REACT_DATA_REACT_ROOT = / data-reactroot=\"\"/g;
export function stripReactExtraMarkup(string: string): string {
  return string
    .replace(REACT_NEW_LINE_COMMENTS_REGEX, '')
    .replace(REACT_DATA_REACT_ROOT, '');
}

/*
 * Since initial JSDOM dom tree is generated from a html string
 * created with "ReactDOMServer.renderToString",
 * dom elements have some extra react-specific extra markup which cause
 * plain deepEquality assertions to fail.
 * Here we strip the extra markup before the equality assertion.
 */
export function expectDOMElementsToMatch(
  actual: Element,
  expected: Element
): void {
  const actualString = stripReactExtraMarkup(actual.outerHTML);
  const expectedString = stripReactExtraMarkup(expected.outerHTML);

  return expect(actualString).toEqual(expectedString);
}
