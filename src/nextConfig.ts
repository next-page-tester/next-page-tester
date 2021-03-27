import loadConfig, { NextConfig } from 'next/dist/next-server/server/config';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import { InternalError } from './_error';

/*
 * @HACK: `loadConfig` bootstraps Webpack in:
 * https://github.com/vercel/next.js/blob/v10.0.8/packages/next/next-server/server/config.ts#L397
 * making execution times at least x4 slower.
 * Here we mock out "loadWebpackHook" called by `loadConfig`
 *
 * @NOTE: This is a very flaky temporary workaround
 */
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const configUtils = require('next/dist/next-server/server/config-utils');
  /* istanbul ignore next */
  if (configUtils && configUtils.loadWebpackHook) {
    configUtils.loadWebpackHook = () => {};
  }
} catch (e) {} // eslint-disable-line no-empty

let nextConfig: NextConfig;
export async function loadNextConfig({ nextRoot }: { nextRoot: string }) {
  nextConfig = await loadConfig(PHASE_DEVELOPMENT_SERVER, nextRoot);
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
