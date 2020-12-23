import { executeAsIfOnServerSync } from './server';

function isJSDOMEnvironment() {
  return navigator && navigator.userAgent.includes('jsdom');
}

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function disableBrowserEnv() {
  if (global.window) {
    //@ts-ignore
    global._window = global.window;
    //@ts-ignore
    delete global.window;
  }
}

function enableBrowserEnv() {
  //@ts-ignore
  if (global._window) {
    //@ts-ignore
    global.window = global._window;
    //@ts-ignore
    delete global._window;
  }
}

export function initTestHelpers() {
  const originalConsoleError = console.error;

  // Ensure imports return always the same React instance
  let mockActualReact: any;
  jest.doMock('react', () => {
    if (!mockActualReact) {
      mockActualReact = jest.requireActual('react');
    }
    return mockActualReact;
  });

  if (isJSDOMEnvironment()) {
    /*
     * This is a dreadful hack to resolve this Next.js module in "non-browser" environment mode.
     * It affects `<head>` elements
     * https://github.com/vercel/next.js/blob/v10.0.3/packages/next/next-server/lib/side-effect.tsx#L3
     */
    // executeAsIfOnServerSync(() => {
    //   require('next/dist/next-server/lib/side-effect');
    // });

    // Mock IntersectionObserver (Link component relies on it)
    if (!global.IntersectionObserver) {
      //@ts-ignore
      global.IntersectionObserver = IntersectionObserver;
    }

    // Mock window.scrollTo (Link component triggers it)
    global.scrollTo = () => {};
  }

  function setup() {
    if (isJSDOMEnvironment()) {
      // Remove initial JSDOM <head> element
      const headElement = document.querySelector('head');
      if (headElement) {
        headElement.remove();
      }

      // Suppress validateDOMNesting error logs
      // we now we're doing borderline stuff like rendering nested html elements
      console.error = (error: string) => {
        if (!error.includes('validateDOMNesting')) {
          originalConsoleError(error);
        }
      };
    }
  }

  function teardown() {
    console.error = originalConsoleError;
  }

  return { setup, teardown };
}
