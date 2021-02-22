import { cleanupDOM } from './makeRenderMethods';
import { cleanupEnvVars } from './setEnvVars';
import { nonIsolatedModules } from './utils';

function isJSDOMEnvironment() {
  return navigator && navigator.userAgent.includes('jsdom');
}

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

export function initTestHelpers() {
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
  }

  // We are intentionally only targeting jest here for it to work with jest.isolatedModules
  // If user has a different test runner we handle it in src/utils where we fallback to stealthy-require
  if (typeof jest !== 'undefined') {
    beforeAll(() => {
      for (const moduleName of nonIsolatedModules) {
        // @NOTE for some reason Jest needs us to pre-import the modules
        // we want to require with jest.requireActual
        require(moduleName);
        jest.mock(moduleName, () => jest.requireActual(moduleName));
      }
    });
  }
}

export function cleanup() {
  cleanupDOM();
  cleanupEnvVars();
}
