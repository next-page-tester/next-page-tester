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

  const goToPageB = () => {
    replace('/b');
  };

  return (
    <div>
      <h2>This is page A</h2>
      <Link href="/b">
        <a>Go to B with Link</a>
      </Link>
      <a onClick={goToPageB}>Go to B programmatically</a>
    </div>
  );
}
