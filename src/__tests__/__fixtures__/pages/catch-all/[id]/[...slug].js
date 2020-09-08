import { sleep } from '../../../../../utils';

export default function catchall_$id$_$slug$(props) {
  return `/ssg/[id] - props: ${props}`;
}

export async function getStaticProps({ params }) {
  await sleep(1);
  return {
    props: {
      params,
    },
  };
}
