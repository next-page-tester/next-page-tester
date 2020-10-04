import { sleep } from '../../../../utils';

export default function CustomAppWithGIP_SSR({ ctx, ...props }) {
  return `custom-app-with-gip/ssr - props: ${JSON.stringify(props, null, ' ')}`;
}

export async function getServerSideProps(ctx) {
  await sleep(1);
  return {
    props: {
      fromPage: true,
      propNameCollision: 'from-page',
    },
  };
}
