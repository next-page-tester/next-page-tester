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
      //@ts-ignore
      global.IntersectionObserver = IntersectionObserver;
    }

    // Mock window.scrollTo (Link component triggers it)
    global.scrollTo = () => {};
  }
}
