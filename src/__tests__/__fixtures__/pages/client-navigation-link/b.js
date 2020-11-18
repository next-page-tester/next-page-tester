import React from 'react';
import Link from 'next/link';
import { sleep } from '../../../../utils';

export default function ClientSideNavigationB(props) {
  return (
    <div>
      <h2>This is page B</h2>
      <Link href="/client-navigation-link/a" scroll={false}>
        <a>Go to page A</a>
      </Link>
    </div>
  );
}

export async function getServerSideProps() {
  await sleep(1);
  return {
    props: {},
  };
}
