import React from 'react';
import { PropsPrinter } from '../../../__utils__';

export default function EnvVarsDataFetchingPage({
  envVarsMock,
  FROM_DOTFILE_DATA_FETCHING,
  NEXT_PUBLIC_FROM_DOTFILE_DATA_FETCHING,
}: {
  envVarsMock: { [key: string]: unknown };
  FROM_DOTFILE_DATA_FETCHING?: string;
  NEXT_PUBLIC_FROM_DOTFILE_DATA_FETCHING?: string;
}) {
  const dataFetchingMethodEnvVars = {
    FROM_DOTFILE_DATA_FETCHING,
    NEXT_PUBLIC_FROM_DOTFILE_DATA_FETCHING,
  };

  return (
    <PropsPrinter
      props={envVarsMock || dataFetchingMethodEnvVars}
      suppressHydrationWarning={true}
    />
  );
}
