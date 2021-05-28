import React from 'react';
import { sleep, PropsPrinter } from '../../../../__utils__/';

export default function CustomAppWithGIPCustomProps_GIP(props) {
  return (
    <>
      /custom-app-with-gip-custom-props/gip -
      <PropsPrinter props={props} />
    </>
  );
}

CustomAppWithGIPCustomProps_GIP.getInitialProps = async () => {
  await sleep(1);
  return { fromPage: true };
};
