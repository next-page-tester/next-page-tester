import React from 'react';
import { RouterQueryPrinter } from '../../../../__utils__';

export default function blog_$id$({ routerMock }) {
  return (
    <>
      /blog/[id] -
      <RouterQueryPrinter routerMock={routerMock} />
    </>
  );
}
