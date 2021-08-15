import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import loadConfig, { NextConfig } from 'next/dist/server/config';
import { InternalError } from './_error';

/*
 * @HACK: `loadConfig` bootstraps Webpack in:
 * https://github.com/vercel/next.js/blob/v11.1.0/packages/next/server/config.ts#L451
 * making execution times at least x4 slower.
 * Here we mock out "loadWebpackHook" called by `loadConfig`
 *
 * @NOTE: This is a very flaky temporary workaround
 */
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const configUtils = require('next/dist/server/config-utils');
  /* istanbul ignore next */
  if (configUtils && configUtils.loadWebpackHook) {
    configUtils.loadWebpackHook = () => {};
  }
} catch (e) {
  /* istanbul ignore next */
  console.warn(
    `[next-page-tester] Can't find Next.js "loadWebpackHook". This might be due to a Next.js internal change. Tests might become sensibly slower.`
  );
}

let nextConfig: NextConfig;
export async function loadNextConfig({
  nextRoot,
}: {
  nextRoot: string;
}): Promise<void> {
  // This env var lets Next.js skip default env vars loading at configuration load
  // We load env vars independently from Next.js
  // https://github.com/vercel/next.js/blob/v10.1.3/packages/next-env/index.ts#L28
  process.env.__NEXT_PROCESSED_ENV = 'true';
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
