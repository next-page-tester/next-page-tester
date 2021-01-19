import loadConfig, { NextConfig } from 'next/dist/next-server/server/config';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import { InternalError } from './_error/error';

let nextConfig: NextConfig;
export function loadNextConfig({ nextRoot }: { nextRoot: string }) {
  nextConfig = loadConfig(PHASE_DEVELOPMENT_SERVER, nextRoot);
}

/*
 * Retrieve Next.js config using Next.js internals
 * https://github.com/vercel/next.js/blob/v10.0.1/test/isolated/config.test.js#L12
 *
 * Default config:
 * https://github.com/vercel/next.js/blob/canary/packages/next/next-server/server/config.ts
 */
export function getNextConfig(): NextConfig {
  /* istanbul ignore if */
  if (!nextConfig) {
    throw new InternalError('getNextConfig called before loadNextConfig');
  }
  return nextConfig;
}
