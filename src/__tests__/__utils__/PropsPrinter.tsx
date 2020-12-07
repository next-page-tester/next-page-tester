import { stringify } from './index';

export function PropsPrinter<T extends object>({ props }: { props: T }) {
  return `props: ${stringify(props)}`;
}
