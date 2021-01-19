import path from 'path';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { getNextConfig } from './nextConfig';
import { RuntimeEnvironment } from './constants';
const { SERVER, CLIENT } = RuntimeEnvironment;

// @NOTE Next.js env var handling implementation is available here:
// https://github.com/vercel/next.js/tree/v10.0.5/test/integration/env-config
// We currently don't use it because there is no way of returning an env vars object
// instead of directly mutating global process.env object
let dotFile: Record<string, string> | undefined = undefined;
export function loadDotFile({ nextRoot }: { nextRoot: string }) {
  const dotFilePath = path.resolve(nextRoot, '.env.local');
  if (existsSync(dotFilePath)) {
    dotFile = dotenvExpand({
      parsed: dotenv.parse(readFileSync(dotFilePath)),
      // @ts-expect-error dotenv-expand type definition is out of date
      ignoreProcessEnv: true,
    }).parsed;
  }
}

let originalEnvVars = process.env;
let envVars:
  | {
      [SERVER]: Record<string, string>;
      [CLIENT]: Record<string, string>;
    }
  | undefined = undefined;

export function setEnvVars({
  runtimeEnv,
}: {
  runtimeEnv: RuntimeEnvironment;
}): void {
  if (!envVars) {
    // Keep a reference to original process.env to restore between tests
    originalEnvVars = process.env;
    const { env: envVarsFromConfig } = getNextConfig();
    const serverEnvVarsFromDotFile = { ...dotFile };
    const clientEnvVarsFromDotFile = { ...dotFile };
    for (const varName in clientEnvVarsFromDotFile) {
      if (!varName.startsWith('NEXT_PUBLIC_')) {
        delete clientEnvVarsFromDotFile[varName];
      }
    }
    envVars = {
      [SERVER]: {
        ...serverEnvVarsFromDotFile,
        ...originalEnvVars,
        ...originalEnvVars,
        ...envVarsFromConfig,
      },
      [CLIENT]: {
        ...clientEnvVarsFromDotFile,
        ...originalEnvVars,
        ...originalEnvVars,
        ...envVarsFromConfig,
      },
    };
  }

  // @NOTE: maybe it's premature optimization (and might cause unexpected bugs):
  // here we replace process.env object instead of mutating it
  process.env = envVars[runtimeEnv];
}

export function cleanupEnvVars() {
  if (process.env !== originalEnvVars) {
    process.env = originalEnvVars;
  }
  dotFile = undefined;
  envVars = undefined;
}
