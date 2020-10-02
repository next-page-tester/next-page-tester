import { sleep } from '../../../../utils';

export default function gip_$id$(props) {
  return `/gip/[id] - props: ${JSON.stringify(props)}`;
}

gip_$id$.getInitialProps = async (ctx) => {
  await sleep(1);
  return ctx;
};
