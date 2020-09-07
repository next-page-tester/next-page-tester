export function parseRoute({ route }) {
  return new URL(`http://test.com${route}`);
}
