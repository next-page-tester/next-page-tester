import { cleanupDOM } from './makeRenderMethods';
import { cleanupEnvVars } from './setEnvVars';

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
}

export function cleanup() {
  cleanupDOM();
  cleanupEnvVars();
}
