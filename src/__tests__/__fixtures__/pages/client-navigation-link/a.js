import React from 'react';
import Link from 'next/link';
import { sleep } from '../../../../utils';

export default function ClientSideNavigationA(props) {
  return (
    <div>
      <h2>This is page A</h2>
      <Link href="/client-navigation-link/b" scroll={false}>
        <a>Go to page B</a>
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
