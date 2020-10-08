import React from 'react';
import { sleep, stringify } from '../../../../utils';

export default function gip_$id$(props) {
  return <>`/gip/[id] - props: ${stringify(props)}`</>;
}

gip_$id$.getInitialProps = async (ctx) => {
  await sleep(1);
  return ctx;
};
