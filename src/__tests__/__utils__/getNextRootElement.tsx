export function getNextRootElement() {
  const nextRootElement = document.getElementById('__next');
  if (!nextRootElement) {
    throw new Error('Could not find Next root element (#__next)');
  }
  return nextRootElement;
}
