import { createContext } from 'react';

export const MockedProvider = createContext<{ source: string }>({
  source: 'Default',
});
