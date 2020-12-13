import React from 'react';
import Link from 'next/link';

export default function PageB() {
  return (
    <>
      <Link href="/proxy-page?destination=/proxy-to-page-a">
        <a>Proxy link</a>
      </Link>
    </>
  );
}
