import { getNextConfig } from './nextConfig';
import { RuntimeEnvironment } from './constants';
const { SERVER, CLIENT } = RuntimeEnvironment;

const originalEnvVars = process.env;
let envVars:
  | {
      [SERVER]: Record<string, string>;
      [CLIENT]: Record<string, string>;
    }
  | undefined = undefined;

export default function setEnvVars({
  runtimeEnv,
}: {
  runtimeEnv: RuntimeEnvironment;
}): void {
  if (!envVars) {
    const { env: envVarsFromConfig } = getNextConfig();
    envVars = {
      [SERVER]: {
        ...originalEnvVars,
        ...envVarsFromConfig,
      },
      [CLIENT]: {
        ...originalEnvVars,
        ...envVarsFromConfig,
      },
    };
  }

  process.env = envVars[runtimeEnv];
}
