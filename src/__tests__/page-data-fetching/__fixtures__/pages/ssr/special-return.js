import { sleep } from '../../../../__utils__';

export default function ssrX() {
  return null;
}

export async function getServerSideProps() {
  await sleep(1);
  return { x: true };
}
