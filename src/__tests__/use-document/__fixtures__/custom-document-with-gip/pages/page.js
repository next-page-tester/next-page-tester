import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CustomDocumentWithGIP_Page() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Head>
        <meta name="description" content="Page description" />
      </Head>
      <span>/custom-document-with-gip/page</span>
      <button onClick={() => setCount((prev) => prev + 1)}>Count me!</button>
      <div>Count: {count}</div>

      <Link href="/a">
        <a>Go to A</a>
      </Link>
    </>
  );
}
