import React from 'react';
import { sleep, stringify } from '../../../../utils';

export default function CustomAppWithGIP_GIP({ ctx, ...props }) {
  return <>`/custom-app-with-gip/gip - props: ${stringify(props)}`</>;
}

CustomAppWithGIP_GIP.getInitialProps = async () => {
  await sleep(1);
  return { fromPage: true, propNameCollision: 'from-page' };
};
