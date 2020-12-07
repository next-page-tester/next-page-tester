import React, { useState } from 'react';

export default function CustomDocumentWithGIP_Page() {
  const [count, setCount] = useState(0);

  return (
    <>
      <span>/custom-document-with-gip/page</span>
      <button onClick={() => setCount((prev) => prev + 1)}>Count me!</button>
      <div>Count: {count}</div>
    </>
  );
}
