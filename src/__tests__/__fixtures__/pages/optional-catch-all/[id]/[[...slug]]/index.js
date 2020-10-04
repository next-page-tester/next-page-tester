import { useRouter } from 'next/router';

export default function optionalcatchall_$id$_$slug$({ routerMock }) {
  const { query } = routerMock || useRouter();
  return `/optional-catch-all/[id]/[...slug]/index - router query: ${JSON.stringify(
    query,
    null,
    ' '
  )}`;
}
