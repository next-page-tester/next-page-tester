import React from 'react';
import type { NextRouter } from 'next/router';
import { RouterPrinter } from '../../../__utils__/';

export default function ClientSideNavigationB({
  routerMock,
}: {
  routerMock?: NextRouter;
}) {
  return (
    <div>
      <h2>This is page B</h2>
      <RouterPrinter routerMock={routerMock} />
    </div>
  );
}
