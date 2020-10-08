import React from 'react';
import { sleep, stringify } from '../../../../utils';

export default function ssg_$id$(props) {
  return <>`/ssg/[id] - props: ${stringify(props)}`</>;
}

export async function getStaticProps({ params }) {
  await sleep(1);
  return {
    props: {
      params,
    },
  };
}
