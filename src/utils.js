export function parseRoute({ route }) {
  return new URL(`http://test.com${route}`);
}

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
