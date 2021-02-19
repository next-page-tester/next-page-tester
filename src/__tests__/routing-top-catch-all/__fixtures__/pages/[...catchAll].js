import React from 'react';
import { RouterQueryPrinter } from '../../../__utils__';

export default function CatchAll_$id$_$slug$({ routerMock }) {
  return (
    <>
      /[...catchAll] -
      <RouterQueryPrinter routerMock={routerMock} />
    </>
  );
}
