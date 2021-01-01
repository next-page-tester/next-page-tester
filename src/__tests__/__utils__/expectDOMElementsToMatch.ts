const REACT_NEW_LINE_COMMENTS_REGEX = /<!-- -->/g;
const REACT_DATA_REACT_ROOT = / data-reactroot=\"\"/g;
export function stripReactReactExtraMarkup(string: string): string {
  return string
    .replace(REACT_NEW_LINE_COMMENTS_REGEX, '')
    .replace(REACT_DATA_REACT_ROOT, '');
}

export function expectDOMElementsToMatch(
  actual: Element,
  expected: Element
): void {
  const actualString = stripReactReactExtraMarkup(actual.outerHTML);
  const expectedString = stripReactReactExtraMarkup(expected.outerHTML);

  return expect(actualString).toEqual(expectedString);
}
