import path from 'path';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { getNextConfig } from './nextConfig';
import { RuntimeEnvironment } from './constants';
const { SERVER, CLIENT } = RuntimeEnvironment;

// @NOTE Next.js env var handling implementation is available here:
// https://github.com/vercel/next.js/tree/v10.0.5/test/integration/env-config
// We can't use it as long as this doesn't get fixed:
// https://github.com/vercel/next.js/issues/21296
let dotenvFile: Record<string, string> | undefined = undefined;
export function loadDotFile({
  nextRoot,
  dotenvFile: dotenvFileRelativePath,
}: {
  nextRoot: string;
  dotenvFile?: string;
}) {
  if (!dotenvFileRelativePath) {
    return;
  }

  const dotenvFilePath = path.resolve(nextRoot, dotenvFileRelativePath);
  if (existsSync(dotenvFilePath)) {
    dotenvFile = dotenvExpand({
      parsed: dotenv.parse(readFileSync(dotenvFilePath)),
      // @ts-expect-error dotenv-expand type definition is out of date
      ignoreProcessEnv: true,
    }).parsed;
  } else {
    console.warn(
      `[next-page-tester] Cannot find env file at path: ${dotenvFilePath}`
    );
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
    const serverEnvVarsFromDotFile = { ...dotenvFile };
    const clientEnvVarsFromDotFile = { ...dotenvFile };
    for (const varName in clientEnvVarsFromDotFile) {
      if (!varName.startsWith('NEXT_PUBLIC_')) {
        delete clientEnvVarsFromDotFile[varName];
      }
    }
    envVars = {
      [SERVER]: {
        ...serverEnvVarsFromDotFile,
        ...originalEnvVars,
        ...envVarsFromConfig,
      },
      [CLIENT]: {
        ...clientEnvVarsFromDotFile,
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
  dotenvFile = undefined;
  envVars = undefined;
}
