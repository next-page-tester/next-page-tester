import React from 'react';
import { RouterQueryPrinter } from '../../../../../__utils__';

export default function CatchAll_$id$_$slug$({ routerMock }) {
  return (
    <>
      /catch-all/[id]/[...slug] -
      <RouterQueryPrinter routerMock={routerMock} />
    </>
  );
}
