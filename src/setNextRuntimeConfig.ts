import { setConfig } from 'next/dist/next-server/lib/runtime-config';
import { RuntimeEnvironment } from './commonTypes';
import { getNextConfig } from './nextConfig';

export default function setNextRuntimeConfig({
  runtimeEnv,
}: {
  runtimeEnv: RuntimeEnvironment;
}): void {
  const config = getNextConfig();
  const { serverRuntimeConfig, publicRuntimeConfig } = config;

  setConfig({
    serverRuntimeConfig: runtimeEnv === 'server' ? serverRuntimeConfig : {},
    publicRuntimeConfig,
  });
}
