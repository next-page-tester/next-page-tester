import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { sleep } from '../../../__utils__/';

export default function ClientSideNavigationA(props) {
  const router = useRouter();
  const goToPageB = () => {
    router.replace('/client-navigation-link/b');
  };
  return (
    <div>
      <h2>This is page A</h2>
      <Link href="/client-navigation-link/b">
        <a>Go to B with Link</a>
      </Link>
      <a onClick={goToPageB}>Go to B programmatically</a>
    </div>
  );
}

export async function getServerSideProps() {
  await sleep(1);
  return {
    props: {},
  };
}
