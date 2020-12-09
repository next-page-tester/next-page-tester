import React from 'react';
import { RouterQueryPrinter } from '../../../../../../__utils__';

export default function OptionalCatchAll_$id$_$slug$({ routerMock }) {
  return (
    <>
      /optional-catch-all/[id]/[...slug]/index -
      <RouterQueryPrinter routerMock={routerMock} />
    </>
  );
}
