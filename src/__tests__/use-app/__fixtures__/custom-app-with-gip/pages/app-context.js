import React from 'react';
import { PropsPrinter } from '../../../../__utils__/';

export default function Index({ ctx }) {
  return (
    <>
      custom-app-with-gip/app-context -
      <PropsPrinter props={ctx} />
    </>
  );
}
