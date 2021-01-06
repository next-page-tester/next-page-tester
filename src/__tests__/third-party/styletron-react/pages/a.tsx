import React from 'react';
import Link from 'next/link';
import { styled } from 'styletron-react';

const RedAnchor = styled('a', { color: 'red' });

export default function PageA() {
  return (
    <Link href="/b">
      <RedAnchor>Go to page B</RedAnchor>
    </Link>
  );
}
