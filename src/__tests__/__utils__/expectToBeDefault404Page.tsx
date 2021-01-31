import React from 'react';
import { renderToString } from 'react-dom/server';
import ErrorPage from 'next/error';
import { NEXT_ROOT_ELEMENT_ID } from '../../constants';
import { parseHTML } from '../../utils';
import { InternalError } from '../../_error/error';
import { expectDOMElementsToMatch } from './index';

export function expectToBeDefault404Page(actual: Element): void {
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
