import { sleep } from '../../../../utils';

export default function CustomAppWithGIP_GIP({ ctx, ...props }) {
  return `/custom-app-with-gip/gip - props: ${JSON.stringify(
    props,
    null,
    ' '
  )}`;
}

CustomAppWithGIP_GIP.getInitialProps = async () => {
  await sleep(1);
  return { fromPage: true, propNameCollision: 'from-page' };
};
