import React from 'react';
import { useRouter } from 'next/router';
import { stringify } from '../../../../../../utils';

export default function optionalcatchall_$id$_$slug$({ routerMock }) {
  const { query } = routerMock || useRouter();
  return (
    <>
      `/optional-catch-all/[id]/[...slug]/index - router query: $
      {stringify(query)}`
    </>
  );
}
