import { sleep } from '../../../../__utils__';

export default function ssr() {
  return null;
}

export async function getServerSideProps() {
  await sleep(1);
  return { unsupportedProp: true };
}
