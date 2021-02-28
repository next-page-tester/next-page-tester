import React from 'react';
import { PropsPrinter } from '../../../../__utils__';

export default function EnvironmentVariablesPage({
  envVarsMock,
}: {
  envVarsMock: { [key: string]: unknown };
}) {
  const {
    NODE_ENV,
    FROM_RUNTIME,
    NEXT_PUBLIC_FROM_RUNTIME,
    FROM_CONFIG,
    NEXT_PUBLIC_FROM_CONFIG,
    FROM_DOTFILE,
    FROM_DOTFILE_EXPANDED,
    NEXT_PUBLIC_FROM_DOTFILE,
    NAME_CLASH_RUNTIME_VS_CONFIG,
    NAME_CLASH_RUNTIME_VS_DOTFILE,
    NAME_CLASH_RUNTIME_VS_CONFIG_VS_DOTFILE,
  } = process.env;

  const envVars = {
    NODE_ENV,
    FROM_RUNTIME,
    NEXT_PUBLIC_FROM_RUNTIME,
    FROM_CONFIG,
    NEXT_PUBLIC_FROM_CONFIG,
    FROM_DOTFILE,
    FROM_DOTFILE_EXPANDED,
    NEXT_PUBLIC_FROM_DOTFILE,
    NAME_CLASH_RUNTIME_VS_CONFIG,
    NAME_CLASH_RUNTIME_VS_DOTFILE,
    NAME_CLASH_RUNTIME_VS_CONFIG_VS_DOTFILE,
  };

  return (
    <PropsPrinter
      props={envVarsMock || envVars}
      suppressHydrationWarning={true}
    />
  );
}
