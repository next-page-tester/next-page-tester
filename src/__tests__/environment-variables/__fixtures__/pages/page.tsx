import React from 'react';
import { PropsPrinter } from '../../../__utils__';

export default function EnvironmentVariablesPage({
  envVarsMock,
}: {
  envVarsMock: { [key: string]: unknown };
}) {
  const {
    FROM_CONFIG,
    FROM_DOTFILE,
    NEXT_PUBLIC_FROM_DOTFILE,
    NEXT_PUBLIC_NAME_CLASH,
  } = process.env;

  const envVars = {
    FROM_CONFIG,
    FROM_DOTFILE,
    NEXT_PUBLIC_FROM_DOTFILE,
    NEXT_PUBLIC_NAME_CLASH,
  };

  return (
    <PropsPrinter
      props={envVarsMock || envVars}
      suppressHydrationWarning={true}
    />
  );
}
