import React from 'react';
import { PropsPrinter, sleep } from '../../../__utils__';

export default function ssg_$id$(props) {
  return (
    <>
      /ssg/[id] -
      <PropsPrinter props={props} />
    </>
  );
}

export async function getStaticProps({ params }) {
  await sleep(1);
  return {
    props: {
      params,
    },
  };
}
