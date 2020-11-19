import { sleep } from '../../../__utils__/';

export default function ssr_notFound() {
  return `/ssr/redirect`;
}

export async function getServerSideProps(ctx) {
  await sleep(1);
  return {
    redirect: {
      destination: '/another-page',
      permanent: false,
    },
  };
}
