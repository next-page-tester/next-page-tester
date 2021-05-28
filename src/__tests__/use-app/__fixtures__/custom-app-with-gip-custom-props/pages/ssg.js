import React from 'react';
import { sleep, PropsPrinter } from '../../../../__utils__/';

export default function CustomAppWithGIPCustomProps_SSG({
  ctx: _ctx,
  ...props
}) {
  return (
    <>
      custom-app-with-gip-custom-props/ssg -
      <PropsPrinter props={props} />
    </>
  );
}

export async function getStaticProps() {
  await sleep(1);
  return {
    props: {
      fromPage: true,
    },
  };
}
