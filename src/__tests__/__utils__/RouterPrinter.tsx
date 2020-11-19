import React from 'react';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { stringify } from './index';

export function RouterPrinter({ routerMock }: { routerMock?: NextRouter }) {
  const router = routerMock || useRouter();
  const { query, pathname, asPath, route, basePath } = router;
  return (
    <>
      Router:
      {stringify({ asPath, pathname, query, route, basePath })}
    </>
  );
}
