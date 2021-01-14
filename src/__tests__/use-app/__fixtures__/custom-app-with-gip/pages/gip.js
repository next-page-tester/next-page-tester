import React from 'react';
import { sleep, PropsPrinter } from '../../../../__utils__/';

export default function CustomAppWithGIP_GIP({ ctx: _ctx, ...props }) {
  return (
    <>
      /custom-app-with-gip/gip -
      <PropsPrinter props={props} />
    </>
  );
}

CustomAppWithGIP_GIP.getInitialProps = async () => {
  await sleep(1);
  return { fromPage: true, propNameCollision: 'from-page' };
};
