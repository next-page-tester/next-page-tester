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
  // Update whole document content with SSR html
  // @NOTE we have to preserve document.body element identity
  // to not break @testing-library global "screen" object

  // @TODO: Update html element attributes
  function renderHTML() {
    const originalBody = document.body;
    document.documentElement.innerHTML = html;
    const bodyContent = document.body.childNodes;
    originalBody.innerHTML = '';
    originalBody.append(...bodyContent);
    document.documentElement.replaceChild(originalBody, document.body);

    const nextRoot = document.getElementById('__next');

    /* istanbul ignore next */
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
