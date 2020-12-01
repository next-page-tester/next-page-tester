import '@testing-library/jest-dom';

beforeAll(() => {
  // Mock global.scrollTo, since Next.js Link component trigger it
  global.scrollTo = jest.fn();
});

beforeEach(() => {
  // Suppress validateDOMNesting error logs
  // we now we're doing borderline stuff like rendering nested html elements
  const consoleError = console.error;
  console.error = jest.fn((error) => {
    if (!error.includes('validateDOMNesting')) {
      consoleError(error);
    }
  });
});

afterEach(() => {
  // @ts-ignore
  console.error.mockRestore();
});
