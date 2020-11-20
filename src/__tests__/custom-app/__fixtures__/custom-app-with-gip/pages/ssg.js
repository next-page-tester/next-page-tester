import React from 'react';
import { sleep, PropsPrinter } from '../../../../__utils__/';

export default function CustomAppWithGIP_SSG({ ctx, ...props }) {
  return (
    <>
      custom-app-with-gip/ssg -
      <PropsPrinter props={props} />
    </>
  );
}

export async function getStaticProps(ctx) {
  await sleep(1);
  return {
    props: {
      fromPage: true,
      propNameCollision: 'from-page',
    },
  };
}
