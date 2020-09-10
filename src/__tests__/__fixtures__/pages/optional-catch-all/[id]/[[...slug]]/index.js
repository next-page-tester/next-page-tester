import { sleep } from '../../../../../../utils';

export default function optionalcatchall_$id$_$slug$(props) {
  return `/optional-catch-all/[id]/[...slug]/index - props: ${JSON.stringify(
    props
  )}`;
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
