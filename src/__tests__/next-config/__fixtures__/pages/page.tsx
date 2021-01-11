import React from 'react';
import getConfig from 'next/config';
import { PropsPrinter } from '../../../__utils__';
const config = getConfig();

export default function RuntimeConfigPage({
  configMock,
}: {
  configMock: { [key: string]: any };
}) {
  return (
    <PropsPrinter
      props={configMock || config}
      suppressHydrationWarning={true}
    />
  );
}
