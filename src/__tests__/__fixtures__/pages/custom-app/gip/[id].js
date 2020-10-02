import { sleep } from '../../../../../utils';

export default function customApp_gip_$id$(props) {
  return `/custom-app/gip/[id] - props: ${JSON.stringify(props)}`;
}

customApp_gip_$id$.getInitialProps = async (ctx) => {
  await sleep(1);
  return ctx;
};
