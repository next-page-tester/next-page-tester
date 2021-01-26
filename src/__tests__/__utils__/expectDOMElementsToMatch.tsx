import React from 'react';
import { renderToString } from 'react-dom/server';
import ErrorPage from 'next/error';
import { NEXT_ROOT_ELEMENT_ID } from '../../constants';
import { parseHTML } from '../../utils';
import { InternalError } from '../../_error/error';

const REACT_NEW_LINE_COMMENTS_REGEX = /<!-- -->/g;
const REACT_DATA_REACT_ROOT = / data-reactroot=""/g;

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

export function expectDOMElementToMatch404Page(actual: Element) {
  const expectedHtml = renderToString(
    <div id={NEXT_ROOT_ELEMENT_ID}>
      <ErrorPage statusCode={404} />
    </div>
  );

  const expectedDocument = parseHTML(expectedHtml);
  const expected = expectedDocument.getElementById(NEXT_ROOT_ELEMENT_ID);
  if (!expected) {
    throw new InternalError(`Missing ${NEXT_ROOT_ELEMENT_ID} div`);
  }

  expectDOMElementsToMatch(actual, expected);
}
