export function makeNextRootElement(): Element {
  const root = document.createElement('div');
  root.id = '__next';
  return root;
}
