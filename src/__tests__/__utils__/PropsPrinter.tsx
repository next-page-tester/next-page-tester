import { stringify } from './index';

export function PropsPrinter({ props }: { props: { [key: string]: unknown } }) {
  return `props: ${stringify(props)}`;
}
