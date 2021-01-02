import React from 'react';
import { stringify } from './index';

export function PropsPrinter<T extends object>({
  suppressHydrationWarning,
  ...props
}: {
  suppressHydrationWarning?: boolean;
  props: T;
}) {
  return (
    <div suppressHydrationWarning={suppressHydrationWarning}>
      `props: ${stringify(props)}`
    </div>
  );
}
