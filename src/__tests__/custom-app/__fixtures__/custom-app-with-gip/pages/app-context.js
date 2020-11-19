import React from 'react';
import { PropsPrinter } from '../../../../__utils__/';

export default function Index({ ctx }) {
  return (
    <>
      /gip/[id] -
      <PropsPrinter props={ctx} />
    </>
  );
}
