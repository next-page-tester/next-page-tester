import React, { useState } from 'react';

export default function CustomDocument() {
  const [count, setCount] = useState(0);

  return (
    <>
      <span>/default-document/page</span>
      <button onClick={() => setCount((prev) => prev + 1)}>Count me!</button>
      <div>Count: {count}</div>
    </>
  );
}
