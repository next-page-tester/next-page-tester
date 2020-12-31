import { render as TLRender } from '@testing-library/react';

// @TODO: Make this methods overridable via options
export default function makeRenderMethods({
  html,
  pageElement,
}: {
  html: string;
  pageElement: JSX.Element;
}) {
  // Replace the whole document content with SSR html
  function renderHTML() {
    document.documentElement.innerHTML = html;
  }

  function render() {
    renderHTML();
    const nextRootElement = document.getElementById('__next');
    if (!nextRootElement) {
      throw new Error('[next-page-tester] Missing __next div');
    }

    // Hydrate page element in existing DOM
    TLRender(pageElement, {
      hydrate: true,
      container: nextRootElement,
    });
  }

  return {
    renderHTML,
    render,
  };
}
