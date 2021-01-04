import ReactDOM from 'react-dom';

// @TODO: Make this methods overridable via options
export default function makeRenderMethods({
  html,
  pageElement,
}: {
  html: string;
  pageElement: JSX.Element;
}): {
  renderHTML: () => { nextRoot: HTMLElement };
  render: () => { nextRoot: HTMLElement };
} {
  // Replace the whole document content with SSR html
  function renderHTML() {
    document.documentElement.innerHTML = html;
    const nextRoot = document.getElementById('__next');
    if (!nextRoot) {
      throw new Error('[next-page-tester] Missing __next div');
    }

    return { nextRoot };
  }

  function render() {
    const { nextRoot } = renderHTML();

    // Hydrate page element in existing DOM
    ReactDOM.hydrate(pageElement, nextRoot);
    return { nextRoot };
  }

  return {
    renderHTML,
    render,
  };
}
