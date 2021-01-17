import React from 'react';
import Link from 'next/link';
import { RedAnchor } from '../RedAnchor';

export default function PageA() {
  return (
    <Link href="/b">
      <RedAnchor>Go to page B</RedAnchor>
    </Link>
  );
}
