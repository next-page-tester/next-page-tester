import { stringify } from '../../../../utils';

export default function api_index(props) {
  return `/api/index - props: ${stringify(props)}`;
}
