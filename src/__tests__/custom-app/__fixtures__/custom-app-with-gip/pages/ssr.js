import React from 'react';
import { sleep, stringify } from '../../../../../utils';

export default function CustomAppWithGIP_SSR({ ctx, ...props }) {
  return <>`custom-app-with-gip/ssr - props: ${stringify(props)}`</>;
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
