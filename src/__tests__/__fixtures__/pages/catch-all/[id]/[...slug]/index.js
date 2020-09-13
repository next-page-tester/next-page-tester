import { useRouter } from 'next/router';

export default function catchall_$id$_$slug$({ routerMock }) {
  const { query } = routerMock || useRouter();
  return `/catch-all/[id]/[...slug]/index - router query: ${JSON.stringify(
    query
  )}`;
}
