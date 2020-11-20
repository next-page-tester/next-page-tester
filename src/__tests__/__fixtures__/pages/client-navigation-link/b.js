import React from 'react';
import { RouterPrinter, sleep } from '../../../__utils__/';

export default function ClientSideNavigationB(props) {
  const { routerMock } = props;
  return (
    <div>
      <h2>This is page B</h2>
      <RouterPrinter routerMock={routerMock} />
    </div>
  );
}

export async function getServerSideProps() {
  await sleep(1);
  return {
    props: {},
  };
}
