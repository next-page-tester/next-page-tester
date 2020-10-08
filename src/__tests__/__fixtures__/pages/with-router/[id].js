import React from 'react';
import { useRouter } from 'next/router';
import { stringify } from '../../../../utils';

export default function WithRouter({ routerMock }) {
  const router = routerMock || useRouter();
  const { query, pathname, asPath, route, basePath } = router;
  return (
    <>
      `Router: $
      {stringify({
        asPath,
        pathname,
        query,
        route,
        basePath,
      })}
      `
    </>
  );
}
