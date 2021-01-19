import { render } from '@testing-library/react';
import { NEXT_ROOT_ELEMENT_ID } from '../../constants';

function makeNextRootElement(): Element {
  const root = document.createElement('div');
  root.id = NEXT_ROOT_ELEMENT_ID;
  return root;
}

export function renderWithinNextRoot(reactElement: JSX.Element) {
  return render(reactElement, {
    container: makeNextRootElement(),
  });
}
