import React, { createContext, useContext } from 'react';
export const MODULE_ENVIRONMENT_AT_LOAD_TIME =
  typeof window === 'undefined' ? 'server' : 'client';

const AppContext = createContext(MODULE_ENVIRONMENT_AT_LOAD_TIME);

export function AppWrapper({ children }) {
  return (
    <AppContext.Provider value={MODULE_ENVIRONMENT_AT_LOAD_TIME}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
