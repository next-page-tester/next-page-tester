import React from 'react';
import Link from 'next/link';

export default function PageB() {
  return (
    <>
      <div>Page B</div>
      <Link href="/proxy-page?destination=/proxy-to-page-a">
        <a>Proxy link</a>
      </Link>
    </>
  );
}
