import { stringify } from '../../../../utils';
import { useRouter } from 'next/router';

export default function blog_$id$({ routerMock }) {
  const { query } = routerMock || useRouter();
  return `/blog/[id] - router query: ${stringify(query)}`;
}
