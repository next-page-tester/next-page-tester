import React from 'react';
import { styled } from 'styletron-react';
import { RedAnchor } from '../RedAnchor';
import Link from 'next/link';

const Panel = styled('div', () => {
  return { backgroundColor: 'orange' };
});

export default function PageB() {
  return (
    <>
      <Panel>This is page B</Panel>
      <Link href="/a">
        <RedAnchor>Go to page A</RedAnchor>
      </Link>
    </>
  );
}
