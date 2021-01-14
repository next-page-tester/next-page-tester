import { setConfig } from 'next/dist/next-server/lib/runtime-config';
import { getNextConfig } from './nextConfig';

export default function setNextRuntimeConfig({
  runtimeEnv,
}: {
  runtimeEnv: 'server' | 'client';
}): void {
  const config = getNextConfig();
  const { serverRuntimeConfig, publicRuntimeConfig } = config;

  envConfig.setConfig({
    serverRuntimeConfig: runtimeEnv === 'server' ? serverRuntimeConfig : {},
    publicRuntimeConfig,
  });
}
