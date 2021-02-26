import React from 'react';
import { useRouter } from 'next/router';
import { basename } from 'path';
import { PageA } from '../PageA';

const expectedRoute = `/${basename(__filename, '.tsx')}`;

export default function ClientSideNavigationA() {
  const { route } = useRouter();

  // Ensure client side navigation updates router & page in same tick
  if (route !== expectedRoute) {
    throw new Error(
      `Unexpected route "${expectedRoute}" but received "${route}"`
    );
  }

  return (
    <PageA
      href="/b?foo=bar"
      hrefObject={{ pathname: '/b', query: { foo: 'bar' } }}
    />
  );
}
