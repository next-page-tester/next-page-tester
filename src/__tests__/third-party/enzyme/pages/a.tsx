import React, { useState } from 'react';
import Link from 'next/link';

export default function PageA() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => setCount((prev) => prev + 1)}>Click me</button>
    </div>
  );
}
