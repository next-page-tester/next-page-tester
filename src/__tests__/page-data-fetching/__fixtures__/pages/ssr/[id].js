import React from 'react';
import { PropsPrinter, sleep } from '../../../../__utils__';

export default function ssr_$id$(props) {
  return (
    <>
      /ssr/[id]
      <PropsPrinter props={props} />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await sleep(1);
  return {
    props: ctx,
  };
}
