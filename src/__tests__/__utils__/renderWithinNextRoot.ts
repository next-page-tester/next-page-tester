import { render } from '@testing-library/react';
import { makeNextRootElement } from './index';

export function renderWithinNextRoot(reactElement: JSX.Element) {
  return render(reactElement, {
    container: makeNextRootElement(),
  });
}
