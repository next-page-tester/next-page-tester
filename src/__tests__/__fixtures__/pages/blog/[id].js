import { useRouter } from 'next/router';
export default function blog_$id$({ routerMock }) {
  const { query } = routerMock || useRouter();
  return `/blog/[id] - router query: ${JSON.stringify(query)}`;
}
