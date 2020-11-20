import React from 'react';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { stringify } from './index';

export function RouterQueryPrinter({
  routerMock,
}: {
  routerMock?: NextRouter;
}) {
  const { query } = routerMock || useRouter();
  return (
    <>
      Router query:
      {stringify(query)}
    </>
  );
}
