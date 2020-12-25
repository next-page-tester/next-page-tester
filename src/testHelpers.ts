import { executeAsIfOnServerSync } from './server';

function isJSDOMEnvironment() {
  return navigator && navigator.userAgent.includes('jsdom');
}

class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

export function initTestHelpers() {
  const originalConsoleError = console.error;

  if (isJSDOMEnvironment()) {
    /*
     * This is a dreadful hack to resolve this Next.js module in "non-browser" environment mode.
     * It allows pages to add new `<head>` elements on first render
     * https://github.com/vercel/next.js/blob/v10.0.3/packages/next/next-server/lib/side-effect.tsx#L3
     */
    executeAsIfOnServerSync(() => {
      require('next/head');
    });

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
