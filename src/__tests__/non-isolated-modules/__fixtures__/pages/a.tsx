import React from 'react';
import { CounterContext } from '../counter';

export default function PageA() {
  return (
    <CounterContext.Consumer>
      {({ count }) => <span>{count}</span>}
    </CounterContext.Consumer>
  );
}
