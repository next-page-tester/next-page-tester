import { sleep } from '../../../../../../utils';

export default function catchall_$id$_$slug$(props) {
  console.log(props);
  return `/catch-all/[id]/[...slug]/index - props: ${props}`;
}

export async function getServerSideProps({ params, query }) {
  await sleep(1);
  return {
    props: {
      params,
      query,
    },
  };
}
