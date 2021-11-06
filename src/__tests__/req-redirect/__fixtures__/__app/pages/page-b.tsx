import React from 'react';
import Link from 'next/link';

export default function PageB() {
  return (
    <div>
      <div>Page B</div>
      <Link href="/page-a?destination=/page-c">
        <a>Link</a>
      </Link>
    </div>
  );
}
