import path from 'path';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { getNextConfig } from './nextConfig';
import { RuntimeEnvironment } from './constants';
const { SERVER, CLIENT } = RuntimeEnvironment;

type EnvVars = Record<string, string | undefined>;

type ScopedEnvVars = {
  [RuntimeEnvironment.SERVER]: EnvVars;
  [RuntimeEnvironment.CLIENT]: EnvVars;
};

function scopeEnvVarsByEnvironment(vars: EnvVars): ScopedEnvVars {
  const serverVars = { ...vars };
  const clientVars = { ...vars };
  for (const varName in vars) {
    if (!varName.startsWith('NEXT_PUBLIC_')) {
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

    return dotenvResult.parsed || {};
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
  const vars = { ...baseEnvVars, ...envVarsFromConfig };
  process.env = scopeEnvVarsByEnvironment(vars)[runtimeEnv];
}

export function loadBaseEnvironment({
  nextRoot,
  dotenvFile,
}: {
  nextRoot: string;
  dotenvFile?: string;
}) {
  const dotenv = loadDotFile({ nextRoot, dotenvFile });
  process.env = { ...dotenv, ...process.env };
  baseEnvVars = process.env;
}

export function cleanupEnvVars() {
  if (process.env !== originalEnvVars) {
    process.env = originalEnvVars;
  }
}
