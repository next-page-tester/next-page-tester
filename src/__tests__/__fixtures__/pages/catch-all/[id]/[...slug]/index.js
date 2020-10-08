import { useRouter } from 'next/router';
import { stringify } from '../../../../../../utils';

export default function catchall_$id$_$slug$({ routerMock }) {
  const { query } = routerMock || useRouter();
  return `/catch-all/[id]/[...slug]/index - router query: ${stringify(query)}`;
}
