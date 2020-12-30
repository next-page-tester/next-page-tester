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

  function setup() {
    if (isJSDOMEnvironment()) {
      // This is needed by NextJS to correctly find the head element which is rendered in `document.body`
      // https://github.com/vercel/next.js/blob/c8cd77a856248346768042f4553a8513195311a4/packages/next/client/head-manager.ts#L36
      const getElementsByTagName = document.getElementsByTagName;
      document.getElementsByTagName = function (tag: string) {
        if (tag === 'head') {
          return document.body.getElementsByTagName('head');
        }
        document.getElementsByTagName = getElementsByTagName;
        return document.getElementsByTagName(tag);
      };

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
