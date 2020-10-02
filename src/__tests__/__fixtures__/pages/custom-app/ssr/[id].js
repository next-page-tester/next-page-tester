import { sleep } from '../../../../../utils';

export default function customApp_ssr_$id$(props) {
  return `/custom-app/ssr/[id] - props: ${JSON.stringify(props)}`;
}

export async function getServerSideProps(ctx) {
  await sleep(1);
  return {
    props: {
      params: ctx.params,
    },
  };
}
