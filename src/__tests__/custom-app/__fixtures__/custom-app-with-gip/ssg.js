import { sleep, stringify } from '../../../../utils';

export default function CustomAppWithGIP_SSG({ ctx, ...props }) {
  return `custom-app-with-gip/ssg - props: ${stringify(props)}`;
}

export async function getStaticProps(ctx) {
  await sleep(1);
  return {
    props: {
      fromPage: true,
      propNameCollision: 'from-page',
    },
  };
}
