import { sleep } from '../../../../utils';

export default function ssg_$id$(props) {
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
