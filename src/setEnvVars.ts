import { getNextConfig } from './nextConfig';
import { RuntimeEnvironment } from './constants';
import { loadEnvConfig } from '@next/env';
const { SERVER, CLIENT } = RuntimeEnvironment;

let dotFile: Record<string, string> | undefined = undefined;
export function loadDotFile({ nextRoot }: { nextRoot: string }) {
  // Temporarily hide global process.env to prevent "@next/env" from mutating it
  const currentProcessEnv = process.env;
  process.env = {};
  const { combinedEnv } = loadEnvConfig(nextRoot);
  process.env = currentProcessEnv;
  dotFile = combinedEnv;
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
