import React from 'react';
import { RouterPrinter } from '../../../__utils__';

export default function WithRouter({ routerMock }) {
  return <RouterPrinter routerMock={routerMock} />;
}
