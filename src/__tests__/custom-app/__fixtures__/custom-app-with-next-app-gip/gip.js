import React from 'react';
import { sleep, stringify } from '../../../../utils';

export default function CustomAppWithNextAppGIP_GIP(props) {
  return <>`/custom-app-with-next-app-gip/gip - props: ${stringify(props)}`</>;
}

CustomAppWithNextAppGIP_GIP.getInitialProps = async () => {
  await sleep(1);
  return { fromPage: true };
};
