import ReactDOM from 'react-dom';

// @TODO: Make this methods overridable via options
export default function makeRenderMethods({
  html,
  pageElement,
}: {
  html: string;
  pageElement: JSX.Element;
}): {
  renderHTML: () => void;
  render: () => HTMLElement;
} {
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
    ReactDOM.hydrate(pageElement, nextRootElement);
    return nextRootElement;
  }

  return {
    renderHTML,
    render,
  };
}
