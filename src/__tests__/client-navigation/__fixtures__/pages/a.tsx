import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { basename } from 'path';

const expectedRoute = `/${basename(__filename, '.tsx')}`;

export default function ClientSideNavigationA() {
  const { replace, route } = useRouter();

  // Ensure client side navigation updates router & page in same tick
  if (route !== expectedRoute) {
    throw new Error(
      `Unexpected route "${expectedRoute}" but received "${route}"`
    );
  }

  const href = '/b?foo=bar';
  const hrefObject = { pathname: '/b', query: { foo: 'bar' } };

  const goToPageBstring = () => {
    replace(href);
  };

  const goToPageBObject = () => {
    replace(hrefObject);
  };

  return (
    <div>
      <h2>This is page A</h2>

      <Link href={href}>
        <a>Go to B with Link (with string)</a>
      </Link>
      <Link href={hrefObject}>
        <a>Go to B with Link (with object)</a>
      </Link>

      <a onClick={goToPageBstring}>Go to B programmatically (with string)</a>
      <a onClick={goToPageBObject}>Go to B programmatically (with object)</a>
    </div>
  );
}
