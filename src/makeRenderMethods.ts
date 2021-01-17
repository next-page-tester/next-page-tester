import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { executeAsIfOnServerSync } from './server';
import { InternalError } from './_error/error';

export function makeRenderMethods({
  serverPageElement,
  clientPageElement,
}: {
  serverPageElement: JSX.Element;
  clientPageElement: JSX.Element;
}): {
  serverRenderToString: () => { html: string };
  serverRender: () => { nextRoot: HTMLElement };
  render: () => { nextRoot: HTMLElement };
} {
  function serverRenderToString() {
    return {
      html: executeAsIfOnServerSync(() =>
        ReactDOMServer.renderToString(serverPageElement)
      ),
    };
  }
  // Update whole document content with SSR html
  function serverRender() {
    const { html } = serverRenderToString();
    const originalBody = document.body;
    const domParser = new DOMParser();
    const newDocument = domParser.parseFromString(html, 'text/html');
    document.replaceChild(
      newDocument.documentElement,
      document.documentElement
    );

    // Replace new body element with original one
    // @NOTE we have to preserve document.body element identity
    // to not break @testing-library global "screen" object
    const bodyContent = document.body.childNodes;
    originalBody.append(...bodyContent);
    document.documentElement.replaceChild(originalBody, document.body);

    const nextRoot = document.getElementById('__next');
    /* istanbul ignore next */
    if (!nextRoot) {
      throw new InternalError('Missing __next div');
    }

    return { nextRoot };
  }

  function render() {
    const { nextRoot } = serverRender();

    // Hydrate page element in existing DOM
    ReactDOM.hydrate(clientPageElement, nextRoot);
    return { nextRoot };
  }

  return {
    serverRenderToString,
    serverRender,
    render,
  };
}

export function cleanup() {
  document.body.innerHTML = '';
  document.head.innerHTML = '';

  // Cleanup html root element attributes
  const html = document.documentElement;
  while (html.attributes.length > 0) {
    html.removeAttribute(html.attributes[0].name);
  }
}
