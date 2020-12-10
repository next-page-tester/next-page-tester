import React from 'react';
import { RouterPrinter } from '../../../__utils__/';

export default function ClientSideNavigationB(props) {
  const { routerMock } = props;
  return (
    <div>
      <h2>This is page B</h2>
      <RouterPrinter routerMock={routerMock} />
    </div>
  );
}
