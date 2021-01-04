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
  if (isJSDOMEnvironment()) {
    // Mock IntersectionObserver (Link component relies on it)
    if (!global.IntersectionObserver) {
      //@ts-ignore
      global.IntersectionObserver = IntersectionObserver;
    }

    // Mock window.scrollTo (Link component triggers it)
    global.scrollTo = () => {};
  }

  // @NOTE: 👇 Down from here is needed only if `useDocument` option is enabled 👇

  executeAsIfOnServerSync(() => {
    // This is a dreadful hack to resolve this Next.js module in "non-browser" environment mode.
    // It allows pages to add new `<head>` elements on initial render.
    // https://github.com/vercel/next.js/blob/v10.0.3/packages/next/next-server/lib/side-effect.tsx#L36
    require('next/head');

    // Patch 'next/document' with our own Main export
    const nextDocument = require('next/document');
    const mockedMain = require('./_document/Main').default;
    nextDocument.Main = mockedMain;
  });
}
