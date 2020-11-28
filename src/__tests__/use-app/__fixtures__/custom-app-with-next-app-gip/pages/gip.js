import React from 'react';
import { sleep, PropsPrinter } from '../../../../__utils__/';

export default function CustomAppWithNextAppGIP_GIP(props) {
  return (
    <>
      /custom-app-with-next-app-gip/gip -
      <PropsPrinter props={props} />
    </>
  );
}

CustomAppWithNextAppGIP_GIP.getInitialProps = async () => {
  await sleep(1);
  return { fromPage: true };
};
