import React from 'react';
import { PropsPrinter, sleep } from '../../../../__utils__';

export default function gip_$id$(props) {
  return (
    <>
      /gip/[id] -
      <PropsPrinter props={props} />
    </>
  );
}

gip_$id$.getInitialProps = async (ctx) => {
  await sleep(1);
  return ctx;
};
