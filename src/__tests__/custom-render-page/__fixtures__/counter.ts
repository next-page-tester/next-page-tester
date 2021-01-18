import { createContext } from 'react';

export const CounterContext = createContext<{ count: number }>({ count: 10 });
