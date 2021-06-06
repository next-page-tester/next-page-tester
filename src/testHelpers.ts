import { cleanupDOM } from './makeRenderMethods';
import { cleanupEnvVars } from './setEnvVars';
import { preservePredefinedSharedModulesIdentity } from './utils';

function isJSDOMEnvironment() {
  return navigator && navigator.userAgent.includes('jsdom');
}

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

export function initTestHelpers(): void {
  if (isJSDOMEnvironment()) {
    // Mock IntersectionObserver (Link component relies on it)
    if (!global.IntersectionObserver) {
      //@ts-expect-error missing DOM types
      global.IntersectionObserver = IntersectionObserver;
    }

    // Mock window.scrollTo (Link component triggers it)
    global.scrollTo = () => {};
  }

  if (typeof document !== 'undefined' && typeof afterEach === 'function') {
    afterEach(cleanup);

    // Disable testing library auto cleanup
    // https://testing-library.com/docs/react-testing-library/setup/#skipping-auto-cleanup
    process.env.RTL_SKIP_AUTO_CLEANUP = 'true';
  }

  // We are intentionally only targeting jest here for it to work with jest.isolatedModules
  // If user has a different test runner we handle it in src/utils where we fallback to stealthy-require
  if (typeof jest !== 'undefined') {
    preservePredefinedSharedModulesIdentity();
  }
}

export function cleanup(): void {
  cleanupDOM();
  cleanupEnvVars();
}
