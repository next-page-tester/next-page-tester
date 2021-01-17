import path from 'path';
import { getNextConfig } from './nextConfig';
import { RuntimeEnvironment } from './constants';
import { existsSync, readFileSync } from 'fs';
import dotenv from 'dotenv';

const { SERVER, CLIENT } = RuntimeEnvironment;
let dotFile: Record<string, string> | undefined = undefined;
export function loadDotFile({ nextRoot }: { nextRoot: string }) {
  const dotFilePath = path.resolve(nextRoot, '.env.local');
  if (existsSync(dotFilePath)) {
    dotFile = dotenv.parse(readFileSync(dotFilePath));
  }
}

let originalEnvVars = process.env;
let envVars:
  | {
      [SERVER]: Record<string, string>;
      [CLIENT]: Record<string, string>;
    }
  | undefined = undefined;

// @NOTE: maybe it's premature optimization (and might cause unexpected bugs):
// setEnvVars replaces process.env object instead of mutating it
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
        ...originalEnvVars,
        ...serverEnvVarsFromDotFile,
        ...envVarsFromConfig,
      },
      [CLIENT]: {
        ...originalEnvVars,
        ...clientEnvVarsFromDotFile,
        ...envVarsFromConfig,
      },
    };
  }

  process.env = envVars[runtimeEnv];
}

export function cleanupEnvVars() {
  if (process.env !== originalEnvVars) {
    process.env = originalEnvVars;
  }
  dotFile = undefined;
  envVars = undefined;
}
