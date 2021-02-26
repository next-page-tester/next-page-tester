import React from 'react';
import { fetcher, PropsPrinter, sleep } from '../../../../__utils__';

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
  await fetcher('resource');
  return {
    props: ctx,
  };
}
