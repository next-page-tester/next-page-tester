import { render } from '@testing-library/react';

function makeNextRootElement(): Element {
  const root = document.createElement('div');
  root.id = '__next';
  return root;
}

export function renderWithinNextRoot(reactElement: JSX.Element) {
  return render(reactElement, {
    container: makeNextRootElement(),
  });
}
