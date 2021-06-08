import React from 'react';
import { sleep, PropsPrinter } from '../../../../__utils__/';

export default function CustomAppWithGIPCustomProps_SSR({
  ctx: _ctx,
  ...props
}) {
  return (
    <>
      custom-app-with-gip-custom-props/ssr -
      <PropsPrinter props={props} />
    </>
  );
}

export async function getServerSideProps() {
  await sleep(1);
  return {
    props: {
      fromPage: true,
    },
  };
}
