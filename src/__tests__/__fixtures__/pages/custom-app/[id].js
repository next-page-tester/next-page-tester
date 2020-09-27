import { sleep } from '../../../../utils';

export default function customApp_$id$(props) {
  return `/custom-app/[id] - props: ${JSON.stringify(props)}`;
}

export async function getServerSideProps(ctx) {
  await sleep(1);
  return {
    props: {
      params: ctx.params,
    },
  };
}
