import { sleep } from '../../../../utils';

export default function CustomAppWithNextAppGIP_GIP(props) {
  return `/custom-app-with-next-app-gip/gip - props: ${JSON.stringify(
    props,
    null,
    ' '
  )}`;
}

CustomAppWithNextAppGIP_GIP.getInitialProps = async () => {
  await sleep(1);
  return { fromPage: true };
};
