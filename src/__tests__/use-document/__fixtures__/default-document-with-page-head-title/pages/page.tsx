import React, { useState } from 'react';
import Head from 'next/head';

export default function CustomDocumentWithPageHeadTitle() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Head>
        <title>Server Side Title</title>
      </Head>
      <span>/default-document-with-page-head-title/page</span>
      <button onClick={() => setCount((prev) => prev + 1)}>Count me!</button>
      <div>Count: {count}</div>
    </>
  );
}
