import React from 'react';
import Link from 'next/link';

export default function index() {
  return (
    <>
      <Link href="/ssr">
        <a>Go to SSR</a>
      </Link>
      <Link href="/gip">
        <a>Go to GIP</a>
      </Link>
      <Link href="/page">
        <a>Go to page</a>
      </Link>
    </>
  );
}
