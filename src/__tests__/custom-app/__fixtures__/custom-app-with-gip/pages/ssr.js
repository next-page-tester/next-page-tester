import React from 'react';
import { sleep, PropsPrinter } from '../../../../__utils__/';

export default function CustomAppWithGIP_SSR({ ctx, ...props }) {
  return (
    <>
      custom-app-with-gip/ssr -
      <PropsPrinter props={props} />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await sleep(1);
  return {
    props: {
      fromPage: true,
      propNameCollision: 'from-page',
    },
  };
}
