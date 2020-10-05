import { stringify } from '../../../../utils';

export default function Index({ ctx }) {
  return `/gip/[id] - props: ${stringify(ctx)}`;
}
