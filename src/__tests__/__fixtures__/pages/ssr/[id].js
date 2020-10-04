import { sleep } from '../../../../utils';

export default function ssr_$id$(props) {
  return `/ssr/[id] - props: ${JSON.stringify(props, null, ' ')}`;
}

export async function getServerSideProps(ctx) {
  await sleep(1);
  return {
    props: ctx,
  };
}
