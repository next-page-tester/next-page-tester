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
