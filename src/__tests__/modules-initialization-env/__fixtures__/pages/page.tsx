import React from 'react';
import { MODULE_ENVIRONMENT_AT_LOAD_TIME, useAppContext } from '../appContext';

export default function ClientServerContextPage() {
  const contextValue = useAppContext();
  return (
    <ul>
      <li>Module initialized in env: {MODULE_ENVIRONMENT_AT_LOAD_TIME}</li>
      <li>React context initialized in env: {contextValue}</li>
    </ul>
  );
}
