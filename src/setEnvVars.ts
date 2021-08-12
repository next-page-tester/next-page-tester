import path from 'path';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { getNextConfig } from './nextConfig';
import { RuntimeEnvironment } from './constants';

const { SERVER, CLIENT } = RuntimeEnvironment;
type EnvVars = Record<string, string | undefined>;
type ScopedEnvVars = Record<RuntimeEnvironment, EnvVars>;

const CLIENT_PASSTHROUGH_VARS = new Set(['NODE_ENV']);

function getEnvVarsByEnvironment(vars: EnvVars): ScopedEnvVars {
  const serverVars = { ...vars };
  const clientVars = { ...vars };
  for (const varName in vars) {
    if (CLIENT_PASSTHROUGH_VARS.has(varName)) {
      continue;
    }

    // @NOTE __NEXT_* vars are used internally by Next.js
    if (!varName.startsWith('NEXT_PUBLIC_') && !varName.startsWith('__NEXT')) {
      delete clientVars[varName];
    }
  }
  return { [SERVER]: serverVars, [CLIENT]: clientVars };
}

// @NOTE Next.js env var handling implementation is available here:
// https://github.com/vercel/next.js/tree/v10.0.5/test/integration/env-config
// We can't use it as long as this doesn't get fixed:
// https://github.com/vercel/next.js/issues/21296

function loadDotFile({
  nextRoot,
  dotenvFile: dotenvFileRelativePath,
}: {
  nextRoot: string;
  dotenvFile?: string;
}): EnvVars {
  if (!dotenvFileRelativePath) {
    return {};
  }

  const dotenvFilePath = path.resolve(nextRoot, dotenvFileRelativePath);
  if (existsSync(dotenvFilePath)) {
    const dotenvResult = dotenvExpand({
      parsed: dotenv.parse(readFileSync(dotenvFilePath)),
      // @ts-expect-error dotenv-expand type definition is out of date
      ignoreProcessEnv: true,
    });

    /* istanbul ignore if */
    if (!dotenvResult.parsed) {
      return {};
    }

    return dotenvResult.parsed;
  } else {
    console.warn(
      `[next-page-tester] Cannot find env file at path: ${dotenvFilePath}`
    );
    return {};
  }
}

const originalEnvVars = process.env;
let baseEnvVars = originalEnvVars;

export function setEnvVars({
  runtimeEnv,
}: {
  runtimeEnv: RuntimeEnvironment;
}): void {
  const { env: envVarsFromConfig } = getNextConfig();
  // Runtime and dotfile env vars are scoped by environment (via NEXT_PUBLIC_ prefix),
  // while env vars coming from next.config.js are available in both environments
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore NODE_ENV expected, but we are passing it so its okay
  process.env = {
    ...getEnvVarsByEnvironment(baseEnvVars)[runtimeEnv],
    ...envVarsFromConfig,
  };
}

export function loadBaseEnvironment({
  nextRoot,
  dotenvFile,
}: {
  nextRoot: string;
  dotenvFile?: string;
}): void {
  const dotenv = loadDotFile({ nextRoot, dotenvFile });
  baseEnvVars = { ...dotenv, ...process.env };
  process.env = baseEnvVars;
}

export function cleanupEnvVars(): void {
  if (process.env !== originalEnvVars) {
    process.env = originalEnvVars;
  }
}
